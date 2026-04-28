(function () {
    const TOKEN_KEY = 'boba_auth_token';
    const USER_KEY = 'boba_auth_user';
    const API_KEY = 'boba_api_url';
    const SAVE_KEY = 'boba_roguelike_save';
    const DEFAULT_API_URL = 'https://boba-roguelike.onrender.com';

    let apiUrl = cleanApiUrl(localStorage.getItem(API_KEY) || window.BOBA_API_URL || DEFAULT_API_URL);
    let token = localStorage.getItem(TOKEN_KEY) || '';
    let user = readJson(localStorage.getItem(USER_KEY));
    let saveUploadTimer = null;
    let lastUploadedSave = '';

    function readJson(value) {
        try {
            return value ? JSON.parse(value) : null;
        } catch (error) {
            return null;
        }
    }

    function cleanApiUrl(value) {
        return String(value || '').trim().replace(/\/+$/, '');
    }

    function setApiUrl(value) {
        apiUrl = cleanApiUrl(value) || DEFAULT_API_URL;
        localStorage.setItem(API_KEY, apiUrl);
        const input = document.getElementById('auth-api-url');
        if (input) {
            input.value = apiUrl;
        }
    }

    function writeAuth(nextToken, nextUser) {
        token = nextToken || '';
        user = nextUser || null;
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    }

    async function request(path, options = {}) {
        const { noAuth, ...fetchOptions } = options;
        const headers = {
            'Content-Type': 'application/json',
            ...(fetchOptions.headers || {})
        };
        if (token && !noAuth) {
            headers.Authorization = `Bearer ${token}`;
        }

        let response;
        try {
            response = await fetch(`${apiUrl}${path}`, {
                ...fetchOptions,
                headers
            });
        } catch (error) {
            throw new Error(`Cannot reach backend at ${apiUrl}. Check your Render URL and deploy logs.`);
        }
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || `Request failed: ${response.status}`);
        }
        return data;
    }

    async function uploadLocalSave() {
        if (!token) return;
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw || raw === lastUploadedSave) return;
        const save = readJson(raw);
        if (!save) return;
        await request('/save', {
            method: 'PUT',
            body: JSON.stringify({ save })
        });
        lastUploadedSave = raw;
    }

    async function fetchLeaderboard() {
        const data = await request('/leaderboard', { noAuth: true });
        return data.leaders || [];
    }

    async function submitRunStats(stats) {
        if (!token) return null;
        const data = await request('/leaderboard/submit', {
            method: 'POST',
            body: JSON.stringify(stats || {})
        });
        return data.stats || null;
    }

    function queueSaveUpload() {
        if (!token) return;
        clearTimeout(saveUploadTimer);
        saveUploadTimer = setTimeout(() => {
            uploadLocalSave().catch(error => console.warn('Cloud save failed', error));
        }, 800);
    }

    async function restoreCloudSave() {
        if (!token) return;
        const data = await request('/save');
        if (!data.save) return;
        const localRaw = localStorage.getItem(SAVE_KEY);
        const local = readJson(localRaw);
        const cloud = data.save;
        const localSavedAt = Number(local?.savedAt || 0);
        const cloudSavedAt = Number(cloud?.savedAt || 0);
        if (!localRaw || cloudSavedAt >= localSavedAt) {
            localStorage.setItem(SAVE_KEY, JSON.stringify(cloud));
        }
    }

    function setMode(mode) {
        const isSignup = mode === 'signup';
        document.getElementById('auth-username-wrap')?.classList.toggle('auth-hidden', !isSignup);
        document.getElementById('auth-login-tab')?.setAttribute('aria-selected', String(!isSignup));
        document.getElementById('auth-signup-tab')?.setAttribute('aria-selected', String(isSignup));
        const submit = document.getElementById('auth-submit');
        const loginInput = document.getElementById('auth-login');
        const passwordInput = document.getElementById('auth-password');
        const usernameInput = document.getElementById('auth-username');
        if (submit) submit.textContent = isSignup ? 'CREATE ACCOUNT' : 'LOGIN';
        if (loginInput) {
            loginInput.placeholder = isSignup ? 'email@example.com' : 'email or username';
            loginInput.autocomplete = isSignup ? 'email' : 'username';
        }
        if (passwordInput) {
            passwordInput.autocomplete = isSignup ? 'new-password' : 'current-password';
        }
        if (usernameInput) {
            usernameInput.required = isSignup;
        }
        document.getElementById('auth-form')?.setAttribute('data-mode', mode);
    }

    function setMessage(message, isGood = false) {
        const node = document.getElementById('auth-message');
        if (!node) return;
        node.textContent = message || '';
        node.style.color = isGood ? '#7cff8a' : '#ffb3b3';
    }

    async function verifyToken() {
        if (!token) return false;
        try {
            const data = await request('/auth/me');
            writeAuth(token, data.user);
            return true;
        } catch (error) {
            writeAuth('', null);
            return false;
        }
    }

    function hideGate() {
        document.getElementById('auth-gate')?.remove();
    }

    async function init({ onReady, setStatus } = {}) {
        setStatus?.('WAITING FOR LOGIN...');
        setApiUrl(apiUrl);

        const form = document.getElementById('auth-form');
        const loginTab = document.getElementById('auth-login-tab');
        const signupTab = document.getElementById('auth-signup-tab');
        const apiInput = document.getElementById('auth-api-url');

        loginTab?.addEventListener('click', () => setMode('login'));
        signupTab?.addEventListener('click', () => setMode('signup'));
        apiInput?.addEventListener('change', () => {
            setApiUrl(apiInput.value);
            setMessage(`Using API: ${apiUrl}`, true);
        });
        setMode('login');

        if (await verifyToken()) {
            setStatus?.('SYNCING CLOUD SAVE...');
            await restoreCloudSave().catch(error => console.warn('Cloud restore failed', error));
            hideGate();
            onReady?.();
            return;
        }

        form?.addEventListener('submit', async event => {
            event.preventDefault();
            const mode = form.getAttribute('data-mode') || 'login';
            const login = document.getElementById('auth-login')?.value || '';
            const password = document.getElementById('auth-password')?.value || '';
            const username = document.getElementById('auth-username')?.value || '';
            setApiUrl(document.getElementById('auth-api-url')?.value || apiUrl);

            setMessage(mode === 'signup' ? 'Creating account...' : 'Logging in...', true);

            try {
                const data = mode === 'signup'
                    ? await request('/auth/register', {
                        method: 'POST',
                        body: JSON.stringify({ username, email: login, password })
                    })
                    : await request('/auth/login', {
                        method: 'POST',
                        body: JSON.stringify({ login, password })
                    });
                writeAuth(data.token, data.user);
                await restoreCloudSave().catch(error => console.warn('Cloud restore failed', error));
                hideGate();
                onReady?.();
            } catch (error) {
                setMessage(error.message || 'Login failed');
            }
        });
    }

    window.BobaAuth = {
        init,
        request,
        queueSaveUpload,
        uploadLocalSave,
        fetchLeaderboard,
        submitRunStats,
        getToken: () => token,
        getUser: () => user,
        getApiUrl: () => apiUrl,
        setApiUrl
    };
}());
