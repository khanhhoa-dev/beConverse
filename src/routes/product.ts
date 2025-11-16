import { Router } from 'express';

import productController from '../app/controller/productsController';
const route = Router({ mergeParams: true });

route.get('/featured', productController.featured);
route.get('/:product', productController.product);
route.get('/:product/filter', productController.filter);

export default route;
