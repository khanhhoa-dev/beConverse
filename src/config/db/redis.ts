import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST, // sử dụng host từ .env
    port: Number(process.env.REDIS_PORT), // sử dụng port từ .env
    password: process.env.REDIS_PASSWORD, // mật khẩu từ .env
    tls: {}, // bắt buộc với Redis cloud
    retryStrategy: time => Math.min(time * 50, 2000),
});

redis.on('error', err => {
    console.log('Redis connection error:', err);
});

redis.on('connect', () => {
    console.log('✅ Connected to Redis successfully!');
});

export default redis;
