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
    '/update-status/:orderCode',
    verifyToken.verify,
    orderDetail.updateOrderStatus,
);
route.get('/reviewed/:id', verifyToken.verifyOwner, orderDetail.orderReviewed);
route.get('/canceled/:id', verifyToken.verifyOwner, orderDetail.orderCanceled);
route.get('/:id', verifyToken.verifyOwner, orderDetail.userOrderInfo);

export default route;
