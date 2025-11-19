import { Request, Response, NextFunction } from 'express';
import ProductsModel from '../model/productsModel';

class UpdateProductController {
    //[PATCH]: localhost:3002/update/product/:slug
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const slug = req.params.slug;
            const updateData = req.body;

            const updatedProduct = await ProductsModel.findOneAndUpdate(
                { slug },
                {
                    $set: updateData,
                },
                { new: true },
            );

            if (!updatedProduct) {
                return res
                    .status(404)
                    .json({ message: 'Product not found', slug });
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    }
}

export default new UpdateProductController();
