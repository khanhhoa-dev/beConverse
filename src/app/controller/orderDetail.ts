import { Request, Response, NextFunction } from 'express';

import CheckOutProductModel from '../model/checkOutModel';

class OrderDetail {
    //[GET] : /order-detail/:id
    userOrderInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idUser = req.params.id;
            if (!idUser) {
                return res.status(400).json({ message: 'Bad Request' });
            }

            const orderDetail = await CheckOutProductModel.find({
                'items.userId': idUser,
                orderStatus: {
                    $in: ['paid', 'shipping', 'pending', 'confirmed'],
                },
                isReviewed: false,
            })
                .sort({ createdAt: -1 })
                .lean();
            if (!orderDetail) {
                return res.status(404).json({ message: 'Not Found' });
            }
            res.status(200).json(orderDetail);
        } catch (error) {
            next(error);
        }
    };
    //[GET] : /order-detail/canceled/:id
    orderCanceled = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idUser = req.params.id;
            if (!idUser) {
                return res.status(400).json({ message: 'Bad Request' });
            }

            const orderCanceled = await CheckOutProductModel.find({
                'items.userId': idUser,
                orderStatus: 'cancel',
                isReviewed: false,
            })
                .sort({ createdAt: -1 })
                .lean();
            if (!orderCanceled) {
                return res.status(404).json({ message: 'Not Found' });
            }
            res.status(200).json(orderCanceled);
        } catch (error) {
            next(error);
        }
    };
    //[GET] : /order-detail/reviewed/:id
    orderReviewed = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idUser = req.params.id;
            if (!idUser) {
                return res.status(400).json({ message: 'Bad Request' });
            }

            const orderReviewed = await CheckOutProductModel.find({
                'items.userId': idUser,
                isReviewed: true,
            })
                .sort({ createdAt: -1 })
                .lean();
            if (!orderReviewed) {
                return res.status(404).json({ message: 'Not Found' });
            }
            res.status(200).json(orderReviewed);
        } catch (error) {
            next(error);
        }
    };

    //[PATCH]: /order-detail/update-status/:orderCode
    updateOrderStatus = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { orderCode } = req.params;
            const { orderStatus } = req.body;

            if (!orderCode) {
                return res.status(400).json({ message: 'Bad Request' });
            }

            const updateOrderStatus =
                await CheckOutProductModel.findOneAndUpdate(
                    {
                        orderCode: orderCode,
                    },
                    {
                        orderStatus: orderStatus,
                    },
                    { new: true },
                );
            if (!updateOrderStatus) {
                return res.status(404).json({ message: 'Not Found orderCode' });
            }
            res.status(200).json({ message: 'Update order successfully!' });
        } catch (error) {
            next(error);
        }
    };
    //[PATCH]: /order-detail/review-order/:orderCode
    reviewOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { orderCode } = req.params;
            if (!orderCode) {
                return res.status(400).json({ message: 'Bad Request' });
            }

            const reviewOrder = await CheckOutProductModel.findOneAndUpdate(
                {
                    orderCode: orderCode,
                },
                {
                    isReviewed: true,
                },
                { new: true },
            );
            if (!reviewOrder) {
                return res.status(404).json({ message: 'Not Found orderCode' });
            }
            res.status(200).json({ message: 'Update order successfully!' });
        } catch (error) {
            next(error);
        }
    };
}

export default new OrderDetail();
