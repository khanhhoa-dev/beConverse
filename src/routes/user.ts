import { Router } from 'express';

import userController from '../app/controller/userController';
import Middleware from '../app/middleware/verifyToken';

const route = Router();

route.delete('/:id', Middleware.verifyOwnerAndAdmin, userController.deleteUser);
route.get('/', Middleware.verify, userController.userAll);

export default route;
