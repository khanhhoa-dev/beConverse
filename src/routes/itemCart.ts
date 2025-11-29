import { Router } from 'express';

import itemsCartController from '../app/controller/itemsCartController';
import verifyToken from '../app/middleware/verifyToken';

const route = Router();

route.delete('/delete/:id', verifyToken.verify, itemsCartController.delete);
route.post('/add', itemsCartController.add);
route.get('/', verifyToken.verify, itemsCartController.show);

export default route;
