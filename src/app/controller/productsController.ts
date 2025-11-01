import { Request, Response, NextFunction } from 'express';

import ProductsModel from '../model/products';

enum ProductType {
    HIGH_TOP = 'high-top',
    LOW_TOP = 'low-top',
    SNEAKERS = 'sneakers',
}

class ProductsController {
    //[GET]:/product
    async show(req: Request, res: Response, next: NextFunction) {
        try {
            const product = req.params.product;
            const homeData = await ProductsModel.find({ category: product });
            res.status(200).json(homeData);
        } catch (error) {
            next(error);
        }
    }

    //[GET] /:product/types/:type
    async typeShoes(req: Request, res: Response, next: NextFunction) {
        try {
            const { type } = req.params;
            console.log(req.params);

            const validTypes = new Set(Object.values(ProductType));
            if (!validTypes.has(type as ProductType)) {
                return res
                    .status(404)
                    .json({ message: 'Không tìm thấy type phù hợp' });
            }

            const dataTypeShoes = await ProductsModel.find({
                type: type,
            });
            res.status(200).json(dataTypeShoes);
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductsController();
