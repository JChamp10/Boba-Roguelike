require('dotenv').config();

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cors = require('cors');
const express = require('express');
const db = require('./db');
const { requireAuth, signToken } = require('./auth');

const app = express();
const port = process.env.PORT || 10000;
const LEADERBOARD_RESET_CODE_HASH = process.env.LEADERBOARD_RESET_CODE_HASH || '0fadc8fc5bad0ac8f42b16aeb31a957373ff9cd4a9ad82041b793b514e8e1c5f';

// BACKEND TUNING: add your GitHub Pages/custom domains to CORS_ORIGIN, comma-separated.
const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    }
}));
app.use(express.json({ limit: '1mb' }));

const multiplayerRooms = new Map();
const MULTIPLAYER_ROOM_TTL_MS = 1000 * 60 * 60;

function makeRoomCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return code;
}

function makePlayerId() {
    return crypto.randomBytes(8).toString('hex');
}

function normalizeRoomCode(code) {
    return String(code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
}

function sanitizeMultiplayerName(name) {
    return String(name || 'Player').trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24) || 'Player';
}

function cleanupMultiplayerRooms() {
    const now = Date.now();
    for (const [code, room] of multiplayerRooms) {
        if (now - room.updatedAt > MULTIPLAYER_ROOM_TTL_MS) {
            multiplayerRooms.delete(code);
        }
    }
}

function publicRoom(room) {
    return {
        code: room.code,
        hostId: room.hostId,
        seed: room.seed,
        startedAt: room.startedAt || null,
        startedBy: room.startedBy || null,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        players: Object.values(room.players).map(player => ({
            id: player.id,
            name: player.name,
            joinedAt: player.joinedAt,
            updatedAt: player.updatedAt,
            state: player.state || null
        }))
    };
}

app.get('/', (req, res) => {
    res.json({
        ok: true,
        service: 'boba-roguelike-api',
        databaseConfigured: db.isConfigured()
    });
});

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function normalizeUsername(username) {
    return String(username || '').trim();
}

function publicUser(row) {
    return {
        id: row.id,
        username: row.username,
        email: row.email,
        createdAt: row.created_at
    };
}

let leaderboardSchemaReady = false;

async function ensureLeaderboardSchema() {
    if (leaderboardSchemaReady) return;
    await db.query(`
        create table if not exists public_player_stats (
            username text primary key,
            high_score integer not null default 0,
            total_kills integer not null default 0,
            best_level integer not null default 1,
            runs_played integer not null default 0,
            updated_at timestamptz not null default now()
        )
    `);
    await db.query('create index if not exists idx_public_player_stats_high_score on public_player_stats (high_score desc)');
    await db.query('create index if not exists idx_public_player_stats_total_kills on public_player_stats (total_kills desc)');
    leaderboardSchemaReady = true;
}

app.get('/health', async (req, res, next) => {
    try {
        if (!db.isConfigured()) {
            return res.status(503).json({
                ok: false,
                databaseConfigured: false,
                error: 'DATABASE_URL is not configured'
            });
        }
        await db.query('select 1');
        res.json({ ok: true, databaseConfigured: true });
    } catch (error) {
        next(error);
    }
});

app.post('/auth/register', async (req, res, next) => {
    try {
        const username = normalizeUsername(req.body.username);
        const email = normalizeEmail(req.body.email);
        const password = String(req.body.password || '');

        if (username.length < 3 || username.length > 24) {
            return res.status(400).json({ error: 'Username must be 3-24 characters' });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Valid email is required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const result = await db.query(
            `insert into users (username, email, password_hash)
             values ($1, $2, $3)
             returning id, username, email, created_at`,
            [username, email, passwordHash]
        );
        const user = publicUser(result.rows[0]);
        res.status(201).json({ user, token: signToken(user) });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        next(error);
    }
});

app.post('/auth/login', async (req, res, next) => {
    try {
        const login = String(req.body.login || req.body.email || '').trim().toLowerCase();
        const password = String(req.body.password || '');

        const result = await db.query(
            `select id, username, email, password_hash, created_at
             from users
             where lower(email) = $1 or lower(username) = $1
             limit 1`,
            [login]
        );
        const row = result.rows[0];
        if (!row || !(await bcrypt.compare(password, row.password_hash))) {
            return res.status(401).json({ error: 'Invalid login' });
        }

        const user = publicUser(row);
        res.json({ user, token: signToken(user) });
    } catch (error) {
        next(error);
    }
});

app.get('/auth/me', requireAuth, async (req, res, next) => {
    try {
        const result = await db.query(
            'select id, username, email, created_at from users where id = $1',
            [req.user.sub]
        );
        if (!result.rows[0]) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user: publicUser(result.rows[0]) });
    } catch (error) {
        next(error);
    }
});

app.get('/save', requireAuth, async (req, res, next) => {
    try {
        const result = await db.query(
            'select save_data, updated_at from game_saves where user_id = $1',
            [req.user.sub]
        );
        res.json({
            save: result.rows[0]?.save_data || null,
            updatedAt: result.rows[0]?.updated_at || null
        });
    } catch (error) {
        next(error);
    }
});

app.put('/save', requireAuth, async (req, res, next) => {
    try {
        const saveData = req.body.save;
        if (!saveData || typeof saveData !== 'object' || Array.isArray(saveData)) {
            return res.status(400).json({ error: 'save must be a JSON object' });
        }

        const result = await db.query(
            `insert into game_saves (user_id, save_data)
             values ($1, $2)
             on conflict (user_id)
             do update set save_data = excluded.save_data
             returning save_data, updated_at`,
            [req.user.sub, saveData]
        );
        res.json({
            save: result.rows[0].save_data,
            updatedAt: result.rows[0].updated_at
        });
    } catch (error) {
        next(error);
    }
});

app.get('/leaderboard', async (req, res, next) => {
    try {
        await ensureLeaderboardSchema();
        const result = await db.query(
            `select username, high_score, total_kills, best_level, runs_played
             from public_player_stats
             order by high_score desc, total_kills desc, updated_at asc
             limit 10`
        );
        res.json({ leaders: result.rows });
    } catch (error) {
        next(error);
    }
});

app.post('/leaderboard/submit', async (req, res, next) => {
    try {
        await ensureLeaderboardSchema();
        const username = normalizeUsername(req.body.username).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 24);
        const score = Math.max(0, Math.floor(Number(req.body.score) || 0));
        const kills = Math.max(0, Math.floor(Number(req.body.totalKills) || 0));
        const level = Math.max(1, Math.floor(Number(req.body.level) || 1));

        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be 3-24 characters' });
        }

        const result = await db.query(
            `insert into public_player_stats (username, high_score, total_kills, best_level, runs_played)
             values ($1, $2, $3, $4, 1)
             on conflict (username)
             do update set
                high_score = greatest(public_player_stats.high_score, excluded.high_score),
                total_kills = greatest(public_player_stats.total_kills, excluded.total_kills),
                best_level = greatest(public_player_stats.best_level, excluded.best_level),
                runs_played = public_player_stats.runs_played + 1,
                updated_at = now()
             returning high_score, total_kills, best_level, runs_played`,
            [username, score, kills, level]
        );
        res.json({ stats: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

app.post('/leaderboard/reset', async (req, res, next) => {
    try {
        const codeHash = crypto
            .createHash('sha256')
            .update(String(req.body.code || '').trim().toUpperCase())
            .digest('hex');
        if (codeHash !== LEADERBOARD_RESET_CODE_HASH) {
            return res.status(403).json({ error: 'Invalid reset code' });
        }
        await ensureLeaderboardSchema();
        await db.query('truncate table public_player_stats');
        res.json({ ok: true });
    } catch (error) {
        next(error);
    }
});

app.post('/multiplayer/rooms', (req, res) => {
    cleanupMultiplayerRooms();
    let code = makeRoomCode();
    while (multiplayerRooms.has(code)) {
        code = makeRoomCode();
    }
    const playerId = makePlayerId();
    const now = Date.now();
    const room = {
        code,
        hostId: playerId,
        seed: crypto.randomInt(1, 1000000000),
        startedAt: null,
        startedBy: null,
        createdAt: now,
        updatedAt: now,
        players: {
            [playerId]: {
                id: playerId,
                name: sanitizeMultiplayerName(req.body.username),
                joinedAt: now,
                updatedAt: now,
                state: null
            }
        }
    };
    multiplayerRooms.set(code, room);
    res.status(201).json({ room: publicRoom(room), playerId });
});

app.post('/multiplayer/rooms/:code/join', (req, res) => {
    cleanupMultiplayerRooms();
    const code = normalizeRoomCode(req.params.code);
    const room = multiplayerRooms.get(code);
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    const playerIds = Object.keys(room.players);
    if (playerIds.length >= 2) {
        return res.status(409).json({ error: 'Room is full' });
    }
    const playerId = makePlayerId();
    const now = Date.now();
    room.players[playerId] = {
        id: playerId,
        name: sanitizeMultiplayerName(req.body.username),
        joinedAt: now,
        updatedAt: now,
        state: null
    };
    room.updatedAt = now;
    res.json({ room: publicRoom(room), playerId });
});

app.get('/multiplayer/rooms/:code', (req, res) => {
    cleanupMultiplayerRooms();
    const room = multiplayerRooms.get(normalizeRoomCode(req.params.code));
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ room: publicRoom(room) });
});

app.post('/multiplayer/rooms/:code/start', (req, res) => {
    cleanupMultiplayerRooms();
    const room = multiplayerRooms.get(normalizeRoomCode(req.params.code));
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    const playerId = String(req.body.playerId || '');
    if (playerId !== room.hostId) {
        return res.status(403).json({ error: 'Only the party leader can start the run' });
    }
    const now = Date.now();
    room.startedAt = now + 2500;
    room.startedBy = playerId;
    room.updatedAt = now;
    res.json({ room: publicRoom(room) });
});

app.post('/multiplayer/rooms/:code/state', (req, res) => {
    cleanupMultiplayerRooms();
    const room = multiplayerRooms.get(normalizeRoomCode(req.params.code));
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    const player = room.players[String(req.body.playerId || '')];
    if (!player) {
        return res.status(403).json({ error: 'Player is not in this room' });
    }
    const rawState = req.body.state || {};
    const now = Date.now();
    const enemySnapshots = Array.isArray(rawState.enemies)
        ? rawState.enemies.slice(0, 90).map(enemy => ({
            id: Math.max(0, Math.floor(Number(enemy.id) || 0)),
            x: Math.max(-200, Math.min(2600, Number(enemy.x) || 0)),
            y: Math.max(-200, Math.min(1900, Number(enemy.y) || 0)),
            hp: Math.max(0, Math.floor(Number(enemy.hp) || 0)),
            maxHp: Math.max(1, Math.floor(Number(enemy.maxHp) || 1)),
            type: enemy.type === 'thrower' ? 'thrower' : 'melee'
        })).filter(enemy => enemy.id > 0)
        : undefined;
    player.state = {
        x: Math.max(0, Math.min(2600, Number(rawState.x) || 0)),
        y: Math.max(0, Math.min(1900, Number(rawState.y) || 0)),
        aimX: Math.max(-200, Math.min(2800, Number(rawState.aimX) || 0)),
        aimY: Math.max(-200, Math.min(2100, Number(rawState.aimY) || 0)),
        health: Math.max(0, Math.floor(Number(rawState.health) || 0)),
        maxHealth: Math.max(1, Math.floor(Number(rawState.maxHealth) || 100)),
        wave: Math.max(1, Math.floor(Number(rawState.wave) || 1)),
        score: Math.max(0, Math.floor(Number(rawState.score) || 0)),
        level: Math.max(1, Math.floor(Number(rawState.level) || 1)),
        down: !!rawState.down,
        build: String(rawState.build || '').slice(0, 48),
        enemies: enemySnapshots,
        updatedAt: now
    };
    player.updatedAt = now;
    room.updatedAt = now;
    res.json({ room: publicRoom(room) });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Boba Roguelike API listening on ${port}`);
});
