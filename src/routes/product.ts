import { Router } from 'express';

import productController from '../app/controller/productsController';
const route = Router({ mergeParams: true });

route.get('/featured', productController.featured);
route.delete('/delete-soft/:id', productController.deleteSoft);
route.delete('/delete-hard/:id', productController.deleteHard);
route.get('/deleted', productController.deleted);
route.patch('/restore/:id', productController.restoreProduct);
route.get('/:product', productController.product);
route.get('/:product/filter', productController.filter);

export default route;
