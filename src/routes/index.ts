import { Application } from 'express';

import productsController from './product';
import detailProductRouter from './detailProduct';
import createProductRouter from './create';
import searchRouter from './search';

function routes(app: Application) {
    app.use('/products', productsController);
    app.use('/creator', createProductRouter);
    app.use('/search', searchRouter);
    app.use('/', detailProductRouter);
}

export default routes;
