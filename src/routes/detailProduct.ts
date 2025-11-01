import { Router } from 'express';

import detailProductController from '../app/controller/detailProductController';

const route = Router();

route.get('/:slug', detailProductController.show);

export default route;
