import { Request, Response, NextFunction } from 'express';

import ProductsModel, { IProducts } from '../model/products';

class createProductController {
    //[GET]: localhost:3002/create/product
    async create(
        req: Request<object, object, IProducts>, //Kiểm tra kiểu đầu vào của body
        res: Response,
        next: NextFunction,
    ) {
        try {
            const data = req.body;
            const saveData = new ProductsModel(data);
            await saveData.save();
            res.status(201).json({ data: saveData });
        } catch (error) {
            next(error);
        }
    }
}

export default new createProductController();
