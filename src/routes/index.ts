import { Application } from 'express';

import authRouter from './auth';
import userRouter from './user';
import productsController from './product';
import detailProductRouter from './detailProduct';
import createProductRouter from './createProduct';
import updateProductRouter from './updateProduct';
import searchRouter from './searchProduct';
import itemCartRouter from './itemCart';
import checkOutRouter from './checkout';
import orderDetailRouter from './orderDetail';

function routes(app: Application) {
    app.use('/auth', authRouter);
    app.use('/users', userRouter);
    app.use('/search', searchRouter);
    app.use('/payment', checkOutRouter);
    app.use('/items-cart', itemCartRouter);
    app.use('/create', createProductRouter);
    app.use('/update', updateProductRouter);
    app.use('/products', productsController);
    app.use('/order-detail', orderDetailRouter);
    app.use('/', detailProductRouter);
}

export default routes;
