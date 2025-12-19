import { Router } from 'express';

import orderDetail from '../app/controller/orderDetail';
import verifyToken from '../app/middleware/verifyToken';

const route = Router();

route.patch(
    '/review-order/:orderCode',
    verifyToken.verify,
    orderDetail.reviewOrder,
);
route.patch(
    '/update-status/:orderCode/:id',
    verifyToken.verifyOwnerAndAdmin,
    orderDetail.updateOrderStatus,
);
route.get('/reviewed/:id', verifyToken.verifyOwner, orderDetail.orderReviewed);
route.get('/canceled/:id', verifyToken.verifyOwner, orderDetail.orderCanceled);
route.get('/all', verifyToken.verifyAdmin, orderDetail.all);
route.get('/:id', verifyToken.verifyOwner, orderDetail.userOrderInfo);

export default route;
