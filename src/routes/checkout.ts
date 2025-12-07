import express, { Router } from 'express';

import checkOutController from '../app/controller/checkOutController';
import verifyToken from '../app/middleware/verifyToken';

const route = Router();

route.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    checkOutController.webhook,
);
route.post(
    '/create-payment',
    verifyToken.verify,
    checkOutController.createPayment,
);

export default route;
