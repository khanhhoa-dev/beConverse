import { Application } from 'express';

import productsController from './product';
import detailProductRouter from './detailProduct';
import createProductRouter from './create';
import updateProductRouter from './update';
import searchRouter from './search';

function routes(app: Application) {
    app.use('/products', productsController);
    app.use('/create', createProductRouter);
    app.use('/update', updateProductRouter);
    app.use('/search', searchRouter);
    app.use('/', detailProductRouter);
}

export default routes;
