import express, { Router } from 'express';

import checkOutController from '../app/controller/checkOutController';
import verifyToken from '../app/middleware/verifyToken';

const route = Router();

route.post(
    '/payos/webhook',
    express.raw({ type: 'application/json' }),
    checkOutController.webhook,
);

route.post('/cod', verifyToken.verify, checkOutController.createPaymentCod);
route.post(
    '/payos/create-url',
    verifyToken.verify,
    checkOutController.createPaymentPayos,
);

export default route;
