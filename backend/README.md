# Boba Roguelike API

Express API for Render + Neon.

## Local Setup

```bash
cd backend
npm install
copy .env.example .env
npm start
```

Set `DATABASE_URL` to your Neon connection string and run `schema.sql` before starting.

## Routes

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /save`
- `PUT /save`
