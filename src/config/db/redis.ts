import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: time => Math.min(time * 50, 2000),
});

redis.on('error', err => {
    console.log('Redis connection error:', err);
});

redis.on('connect', () => {
    console.log('✅ Connected to Redis successfully!');
});

export default redis;
