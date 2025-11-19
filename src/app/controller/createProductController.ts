import { Request, Response, NextFunction } from 'express';

import ProductsModel, { IProducts } from '../model/productsModel';

class createProductController {
    //[POST]: localhost:3002/create/product
    async create(
        req: Request<object, object, IProducts>,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const data = req.body;
            const saveData = new ProductsModel(data);
            await saveData.save();
            res.status(201).json({ message: 'Create Product Successful' });
        } catch (error) {
            next(error);
        }
    }
}

export default new createProductController();
