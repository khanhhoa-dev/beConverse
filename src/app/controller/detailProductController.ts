import { Request, Response, NextFunction } from 'express';

import ProductsModel from '../model/productsModel';

class DetailProductController {
    //[GET]: localhost:3002/:slug
    async show(req: Request, res: Response, next: NextFunction) {
        try {
            const slug = req.params.slug;
            const detailProduct = await ProductsModel.find({ slug: slug });
            res.status(200).json(detailProduct);
        } catch (error) {
            next(error);
        }
    }
}

export default new DetailProductController();
