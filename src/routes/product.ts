import { Router } from 'express';

import productController from '../app/controller/productsController';
import verifyToken from '../app/middleware/verifyToken';
const route = Router({ mergeParams: true });

route.get('/all', verifyToken.verifyAdmin, productController.show);
route.post('/update-quantity', productController.updateQuantity);
route.get('/featured', productController.featured);
route.delete('/delete-soft/:id', productController.deleteSoft);
route.delete('/delete-hard/:id', productController.deleteHard);
route.get('/deleted', productController.deleted);
route.patch('/restore/:id', productController.restoreProduct);
route.get('/:product/filter', productController.filter);
route.get('/:product', productController.product);

export default route;
