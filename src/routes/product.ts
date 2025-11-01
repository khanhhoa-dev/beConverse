import { Router } from 'express';

import productController from '../app/controller/productsController';
const route = Router({ mergeParams: true });

route.get('/:product', productController.show);
route.get('/:product/types/:type', productController.typeShoes);

export default route;
