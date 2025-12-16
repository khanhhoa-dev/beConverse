import dotenv from 'dotenv';

dotenv.config();

export const payosConfig = {
    clientId: process.env.PAYOS_CLIENT_ID,
    apiKey: process.env.PAYOS_API_KEY,
    checksumKey: process.env.PAYOS_CHECKSUM_KEY,
    returnUrl: 'https://fe-converse.onrender.com/order-detail',
    cancelUrl: 'https://fe-converse.onrender.com/pay',
};
