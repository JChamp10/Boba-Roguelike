(function () {
    const USERNAME_KEY = 'boba_player_username';
    const API_KEY = 'boba_api_url';
    const SAVE_KEY = 'boba_roguelike_save';
    const DEFAULT_API_URL = 'https://boba-roguelike.onrender.com';

    let apiUrl = cleanApiUrl(window.BOBA_API_URL || localStorage.getItem(API_KEY) || DEFAULT_API_URL);
    if (apiUrl.includes('boba-roguelike-api.onrender.com')) {
        apiUrl = DEFAULT_API_URL;
        localStorage.setItem(API_KEY, apiUrl);
    }

    function cleanApiUrl(value) {
        return String(value || '').trim().replace(/\/+$/, '');
    }

    function sanitizeUsername(value) {
        return String(value || '')
            .trim()
            .replace(/[^a-zA-Z0-9_-]/g, '')
            .slice(0, 24);
    }

    function getUsername() {
        return sanitizeUsername(localStorage.getItem(USERNAME_KEY) || '');
    }

    function setUsername(value) {
        const username = sanitizeUsername(value);
        if (username) {
            localStorage.setItem(USERNAME_KEY, username);
        } else {
            localStorage.removeItem(USERNAME_KEY);
        }
        syncUsernameInput();
        return username;
    }

    function setApiUrl(value) {
        apiUrl = cleanApiUrl(value) || DEFAULT_API_URL;
        localStorage.setItem(API_KEY, apiUrl);
        return apiUrl;
    }

    async function request(path, options = {}) {
        let response;
        try {
            response = await fetch(`${apiUrl}${path}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            });
        } catch (error) {
            throw new Error(`Cannot reach leaderboard at ${apiUrl}.`);
        }

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || `Request failed: ${response.status}`);
        }
        return data;
    }

    async function fetchLeaderboard() {
        const data = await request('/leaderboard');
        return data.leaders || [];
    }

    async function submitRunStats(stats) {
        const username = getUsername();
        if (username.length < 3) return null;
        const data = await request('/leaderboard/submit', {
            method: 'POST',
            body: JSON.stringify({ ...stats, username })
        });
        return data.stats || null;
    }

    function encodeSaveCode(payload) {
        const json = JSON.stringify(payload);
        return btoa(unescape(encodeURIComponent(json)));
    }

    function decodeSaveCode(code) {
        const json = decodeURIComponent(escape(atob(String(code || '').trim())));
        return JSON.parse(json);
    }

    function exportSaveCode() {
        const rawSave = localStorage.getItem(SAVE_KEY);
        const payload = {
            type: 'boba-roguelike-save',
            version: 1,
            exportedAt: Date.now(),
            username: getUsername(),
            save: rawSave ? JSON.parse(rawSave) : null
        };
        return encodeSaveCode(payload);
    }

    function importSaveCode(code) {
        const payload = decodeSaveCode(code);
        if (payload?.type !== 'boba-roguelike-save' || !payload.save || typeof payload.save !== 'object') {
            throw new Error('That save code is not valid.');
        }
        localStorage.setItem(SAVE_KEY, JSON.stringify(payload.save));
        if (payload.username) setUsername(payload.username);
    }

    function syncUsernameInput() {
        const input = document.getElementById('profile-username');
        if (input && input.value !== getUsername()) {
            input.value = getUsername();
        }
    }

    function setProfileMessage(message, isGood = true) {
        const node = document.getElementById('profile-message');
        if (!node) return;
        node.textContent = message || '';
        node.dataset.state = isGood ? 'good' : 'bad';
    }

    function openSavePanel(mode) {
        const panel = document.getElementById('save-code-panel');
        const title = document.getElementById('save-code-title');
        const text = document.getElementById('save-code-text');
        const apply = document.getElementById('save-code-apply');
        if (!panel || !title || !text || !apply) return;

        panel.classList.remove('hidden');
        panel.dataset.mode = mode;
        apply.hidden = mode !== 'import';
        title.textContent = mode === 'import' ? 'IMPORT SAVE CODE' : 'EXPORT SAVE CODE';
        text.readOnly = mode !== 'import';
        text.value = mode === 'import' ? '' : exportSaveCode();
        text.focus();
        text.select();
    }

    function closeSavePanel() {
        document.getElementById('save-code-panel')?.classList.add('hidden');
    }

    function bindProfileTools() {
        const usernameInput = document.getElementById('profile-username');
        const exportButton = document.getElementById('save-export');
        const importButton = document.getElementById('save-import');
        const closeButton = document.getElementById('save-code-close');
        const applyButton = document.getElementById('save-code-apply');
        const text = document.getElementById('save-code-text');

        syncUsernameInput();
        usernameInput?.addEventListener('change', () => {
            const username = setUsername(usernameInput.value);
            setProfileMessage(username.length >= 3 ? `Scores save as ${username}.` : 'Use 3+ characters for leaderboard saves.', username.length >= 3);
        });
        usernameInput?.addEventListener('blur', () => usernameInput.value = getUsername());
        exportButton?.addEventListener('click', () => openSavePanel('export'));
        importButton?.addEventListener('click', () => openSavePanel('import'));
        closeButton?.addEventListener('click', closeSavePanel);
        applyButton?.addEventListener('click', () => {
            try {
                importSaveCode(text?.value || '');
                setProfileMessage('Save imported. Reloading...', true);
                window.location.reload();
            } catch (error) {
                setProfileMessage(error.message || 'Could not import save.', false);
            }
        });
    }

    async function init({ onReady, setStatus } = {}) {
        setStatus?.('LOADING LOCAL PROFILE...');
        bindProfileTools();
        onReady?.();
    }

    window.BobaAuth = {
        init,
        request,
        queueSaveUpload: () => {},
        uploadLocalSave: () => Promise.resolve(null),
        fetchLeaderboard,
        submitRunStats,
        getToken: () => '',
        getUser: () => ({ username: getUsername() }),
        getUsername,
        setUsername,
        getApiUrl: () => apiUrl,
        setApiUrl,
        exportSaveCode,
        importSaveCode
    };
}());
