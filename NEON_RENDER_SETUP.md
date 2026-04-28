# Neon + Render Backend Setup

This repo is now shaped for:

- GitHub Pages: hosts the static Phaser game.
- Render Web Service: hosts the login/save API.
- Neon Postgres: stores accounts and cloud saves.

## 1. Neon Database

1. Create a Neon project.
2. Click Connect in the Neon dashboard.
3. Copy the pooled Postgres connection string for app/server use.
4. In Render, save that string as `DATABASE_URL`.
5. Run the SQL in `backend/schema.sql` in Neon's SQL Editor.

Neon connection strings look like this:

```txt
postgresql://user:password@host/dbname?sslmode=require
```

Use an environment variable. Do not paste the connection string into client-side game code.

## 2. Render Web Service

Create a new Render Web Service connected to this GitHub repo:

```txt
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Environment variables:

```txt
DATABASE_URL=your_neon_connection_string
JWT_SECRET=make_this_a_long_random_secret
CORS_ORIGIN=https://jchamp10.github.io
```

Render provides `PORT`; the backend reads it automatically.

## 3. API Endpoints

```txt
GET  /health
POST /auth/register
POST /auth/login
GET  /auth/me
GET  /save
PUT  /save
```

Auth requests use JSON:

```json
{
  "username": "player",
  "email": "player@example.com",
  "password": "your-password"
}
```

Authenticated requests need:

```txt
Authorization: Bearer YOUR_TOKEN
```

## 4. Database Tables

Run `backend/schema.sql`. The main tables are `users` and `game_saves`.

`users` stores login identity. `game_saves` stores one JSON save blob per user, matching the current localStorage save format.

## 5. Hooking The Game To The Backend

The website now opens a login/signup gate before Phaser starts. The browser auth client lives in `js/auth-client.js`.

Login flow:

1. `POST /auth/register` or `POST /auth/login`.
2. Save the returned JWT in localStorage.
3. Call `GET /save` before loading the game.
4. Let the normal game save system write localStorage.
5. `SaveManager.save()` calls `window.BobaAuth.queueSaveUpload()` to sync to Neon.

Keep all database access inside the Render backend. GitHub Pages should only call your public API URL.

If your Render service URL is different from the default, set this before `js/auth-client.js` loads:

```html
<script>
  window.BOBA_API_URL = 'https://your-render-service.onrender.com';
</script>
```
