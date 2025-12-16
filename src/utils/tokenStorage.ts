import redis from '../config/db/redis/redis';
import jwt from 'jsonwebtoken';

const REFRESH_TOKEN_PREFIX = 'refresh:user';

// Lưu refresh token (có thời hạn)
export const storeRefreshToken = async (
    userID: string,
    refreshToken: string,
    expiresInDays: number = 365,
) => {
    const decode = jwt.decode(refreshToken) as any;
    const jti = decode.jti;
    const key = `${REFRESH_TOKEN_PREFIX}:${userID}:${jti}`;

    await redis.set(
        `token:${refreshToken}`,
        jti,
        'EX',
        expiresInDays * 24 * 60 * 60,
    );
    await redis.set(key, 1, 'EX', expiresInDays * 24 * 60 * 60);
    return { jti, key };
};

//Kiểm tra token có hợp lệ hay không
export const verifyAndConsumeRefreshToken = async (
    token: string,
    userId: string,
) => {
    const storeJti = await redis.get(`token:${token}`);
    if (!storeJti) return null;

    const exists = await redis.exists(
        `${REFRESH_TOKEN_PREFIX}:${userId}:${storeJti}`,
    );
    if (!exists) {
        await blacklistAllTokenOfUser(userId);
        throw new Error('Refresh token reuse detected!');
    }
    await redis.del(`token:${token}`);
    await redis.del(`${REFRESH_TOKEN_PREFIX}:${userId}:${storeJti}`);

    return storeJti;
};

//Logout tất cả các thiết bị của User
export const blacklistAllTokenOfUser = async (userId: string) => {
    const key = await redis.keys(`${REFRESH_TOKEN_PREFIX}:${userId}`);
    if (key.length > 0) {
        await redis.del(...key);
    }
    console.log(`All devices logged out for user ${userId}`);
};
