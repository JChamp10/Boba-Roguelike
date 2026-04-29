const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = connectionString
    ? new Pool({
        connectionString,
        ssl: connectionString.includes('sslmode=require') || connectionString.includes('neon.tech')
            ? { rejectUnauthorized: false }
            : undefined
    })
    : null;

module.exports = {
    query(text, params) {
        if (!pool) {
            throw new Error('DATABASE_URL is not configured');
        }
        return pool.query(text, params);
    },
    isConfigured() {
        return !!pool;
    },
    pool
};
