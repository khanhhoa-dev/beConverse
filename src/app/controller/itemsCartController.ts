import { Request, Response, NextFunction } from 'express';

import ItemCartModel from '../model/itemCartModel';

class ItemCartController {
    //[DELETE]: /items-cart/delete/:id
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            if (!id) return res.status(404).json({ message: 'Id Not Found' });
            const deleteItem = await ItemCartModel.findByIdAndDelete({
                _id: id,
                userId,
            });
            res.status(200).json({
                message: 'Product deleted successfully!',
                deleteItem,
            });
        } catch (error) {
            next(error);
        }
    };

    //[POST]: /items-cart/add
    add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                userId,
                productId,
                quantity = 1,
                color,
                size,
                name,
                price,
                image,
            } = req.body;
            if (!productId || !name || !price || quantity < 1) {
                return res.status(400).json({
                    message: 'Missing required fields or invalid quantity',
                });
            }

            const totalCart = await ItemCartModel.countDocuments({ userId });

            //Check exists product
            const existsItem = await ItemCartModel.findOne({
                userId,
                productId,
                size,
                color,
            });
            if (existsItem) {
                existsItem.quantity += quantity;
                existsItem.price = price;
                await existsItem.save();
                return res.status(200).json({
                    message: 'Updated cart item successfully!',
                    item: existsItem,
                    totalCart,
                });
            }

            const newItem = new ItemCartModel({
                userId,
                productId,
                quantity,
                color,
                size,
                name,
                price,
                image,
            });
            await newItem.save();
            res.status(200).json({
                message: 'Added product to cart successfully!',
                item: newItem,
                totalCart,
            });
        } catch (error) {
            console.error('Add to cart error:', error);
            next(error);
        }
    };

    //[GET]: /items-cart/
    show = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.user?.id;
            if (!id) return res.json({ message: 'Invalid id' });
            const dataCart = await ItemCartModel.find({ userId: id }).sort({
                createdAt: -1,
            });
            const totalCart = await ItemCartModel.countDocuments({
                userId: id,
            });
            if (!dataCart)
                return res.json({
                    message: 'There are no products in the cart.',
                });
            res.status(200).json({ dataCart, totalCart });
        } catch (error) {
            next(error);
        }
    };
}

export default new ItemCartController();
