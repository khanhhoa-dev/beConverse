import { Application } from 'express';

import productsController from './product';
import detailProductRouter from './detailProduct';
import createProductRouter from './create';

function routes(app: Application) {
    app.use('/product', productsController);
    app.use('/creator', createProductRouter);
    app.use('/', detailProductRouter);
}

export default routes;
