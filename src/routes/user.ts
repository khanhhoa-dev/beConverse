import { Router } from 'express';

import userController from '../app/controller/userController';
import Middleware from '../app/middleware/verifyToken';

const route = Router();

route.patch(
    '/update-role/:id',
    Middleware.verifyAdmin,
    userController.updateRole,
);
route.delete('/:id', Middleware.verifyOwnerAndAdmin, userController.deleteUser);
route.get('/', Middleware.verifyAdmin, userController.userAll);

export default route;
