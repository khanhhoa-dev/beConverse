import { Application } from 'express';

import authRouter from './auth';
import userRouter from './user';
import productsController from './product';
import detailProductRouter from './detailProduct';
import createProductRouter from './createProduct';
import updateProductRouter from './updateProduct';
import searchRouter from './searchProduct';
import itemCartRouter from './itemCart';

function routes(app: Application) {
    app.use('/items-cart', itemCartRouter);
    app.use('/auth', authRouter);
    app.use('/users', userRouter);
    app.use('/products', productsController);
    app.use('/create', createProductRouter);
    app.use('/update', updateProductRouter);
    app.use('/search', searchRouter);
    app.use('/', detailProductRouter);
}

export default routes;
