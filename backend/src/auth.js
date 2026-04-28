const jwt = require('jsonwebtoken');

function getJwtSecret() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is required');
    }
    return process.env.JWT_SECRET;
}

function signToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            username: user.username,
            email: user.email
        },
        getJwtSecret(),
        { expiresIn: '30d' }
    );
}

function requireAuth(req, res, next) {
    const header = req.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';

    if (!token) {
        return res.status(401).json({ error: 'Missing auth token' });
    }

    try {
        req.user = jwt.verify(token, getJwtSecret());
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid auth token' });
    }
}

module.exports = {
    requireAuth,
    signToken
};
