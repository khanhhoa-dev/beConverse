import Redis from 'ioredis';

const redis = new Redis({
    host: 'localhost',
    port: 6379,
    retryStrategy: time => Math.min(time * 50, 2000),
});

redis.on('error', err => {
    console.log('Redis connection error:', err);
});

redis.on('connect', () => {
    console.log('Connected to Redis successfully!');
});

export default redis;
