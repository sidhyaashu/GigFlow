const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Connected'));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.warn('Redis Connection Failed. Caching will be disabled.');
    }
})();

module.exports = redisClient;
