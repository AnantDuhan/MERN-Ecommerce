const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const IORedis = require('ioredis');

const json429 = message => (req, res) =>
    res.status(429).json({ success: false, message });

// Shared store so rate limits are enforced across ALL instances, not per
// process. Falls back to the built-in in-memory store when REDIS_URL is unset
// (e.g. local single-instance dev), so nothing breaks without Redis.
let store;
if (process.env.REDIS_URL) {
    const client = new IORedis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    });
    client.on('error', err => console.error('Rate-limit Redis error:', err.message));
    store = new RedisStore({
        sendCommand: (...args) => client.call(...args),
        prefix: 'rl:',
    });
    console.info('Rate limiter: using shared Redis store');
} else {
    console.info('Rate limiter: using in-memory store (single instance)');
}

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: req => req.originalUrl.includes('/health'),
    handler: json429('Too many requests - please slow down and try again shortly.'),
    ...(store ? { store } : {}),
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: json429('Too many attempts - please wait a few minutes and try again.'),
    ...(store ? { store } : {}),
});

module.exports = { apiLimiter, authLimiter };
