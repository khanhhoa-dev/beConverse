import { Router } from 'express';

import createProductController from '../app/controller/createProductController';
const route = Router();

route.post('/product', createProductController.create);

export default route;
