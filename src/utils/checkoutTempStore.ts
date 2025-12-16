import redis from '../config/db/redis/redis';
import type { IDataOrder } from '../app/controller/checkOutController';

const CHECKOUT_PREFIX = 'checkout-temp:';
//Set
export const saveCheckoutTemp = async (orderCode: number, data: IDataOrder) => {
    await redis.set(
        `${CHECKOUT_PREFIX}${orderCode}`,
        JSON.stringify(data),
        'EX',
        60 * 60,
    );
};

//Get
export const getCheckoutTemp = async (orderCode: number) => {
    const result = await redis.get(`${CHECKOUT_PREFIX}${orderCode}`);
    return result ? JSON.parse(result) : null;
};

//Delete
export const deleteCheckoutTemp = async (orderCode: number) => {
    await redis.del(`${CHECKOUT_PREFIX}${orderCode}`);
};
