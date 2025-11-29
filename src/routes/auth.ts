import { Router } from 'express';
import authController from '../app/controller/authController';
import verifyToken from '../app/middleware/verifyToken';

const route = Router();

route.post('/logout', verifyToken.verify, authController.logout);
route.post('/refresh', authController.refresh);
route.post('/register', authController.register);
route.post('/login', authController.login);

export default route;
