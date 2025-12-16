import { PayOS } from '@payos/node';
import { Request, Response, NextFunction } from 'express';

import ItemCartModel from '../model/itemCartModel';
import { payosConfig } from '../../config/payos/payos';
import CheckOutProductModel from '../model/checkOutModel';
import type { ICheckOutItem } from '../model/checkOutModel';
import * as checkoutRedis from '../../utils/checkoutTempStore';

const payos = new PayOS({
    clientId: payosConfig.clientId,
    apiKey: payosConfig.apiKey,
    checksumKey: payosConfig.checksumKey,
});

interface IItemOrder {
    name: string;
    price: number;
    quantity: number;
}
interface IBodyPayos {
    orderCode: number;
    amount: number;
    description: string;
    items: IItemOrder[];
    returnUrl: string;
    cancelUrl: string;
}

export interface IDataOrder {
    fullname: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: string;
    shippingMethod: string;
    total: number;
    items: ICheckOutItem[];
}

class CheckOutController {
    //[POST]: payment/cod
    createPaymentCod = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const paymentData = req.body;
            const orderCode = Number(Date.now());
            if (!paymentData) {
                res.status(400).json({ message: 'Invalid Data' });
            }
            const savePaymentData = {
                ...paymentData,
                orderCode,
                orderId: `COD_${orderCode}`,
            };
            const saveDataPayment = new CheckOutProductModel(savePaymentData);
            await saveDataPayment.save();

            //Xóa product khỏi giỏ hàng
            try {
                const conditions = paymentData.items.map(
                    (item: ICheckOutItem) => ({
                        _id: item._id,
                        userId: item.userId,
                        productId: item.productId,
                        color: item.color,
                        size: item.size,
                    }),
                );
                await ItemCartModel.deleteMany({
                    $or: conditions,
                });
                res.status(200).json({ message: 'Deleted Successfully' });
            } catch (error) {
                console.log('Error:', error);
                next(error);
            }

            res.status(200).json({ message: 'Payment successfully' });
        } catch (error) {
            console.log('Error:', error);
            next(error);
        }
    };

    //[POST] : payment/payos/create-url
    createPaymentPayos = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const paymentData: IDataOrder = req.body;
            const orderCode = Date.now();

            // Lưu dữ liệt và Redis
            await checkoutRedis.saveCheckoutTemp(orderCode, paymentData);

            const body: IBodyPayos = {
                orderCode,
                amount: paymentData.total,
                description: `#${orderCode}`,
                items: paymentData.items.map((item: any) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                returnUrl: payosConfig.returnUrl,
                cancelUrl: payosConfig.cancelUrl,
            };

            const paymentLink = await payos.paymentRequests.create(body);

            res.status(200).json({
                checkoutUrl: paymentLink.checkoutUrl,
                orderCode,
            });
        } catch (error) {
            console.error('Checkout error:', error);
            next(error);
        }
    };

    //[POST]: payment/payos/webhook
    webhook = async (req: Request, res: Response) => {
        try {
            const webhookData = req.body;

            const verifiedData = payos.webhooks.verify(webhookData);
            if (!verifiedData) {
                console.log('Invalid Signature');
                return res.status(400).json({ message: 'Invalid Signature' });
            }

            if (webhookData.code === '00' && webhookData.success === true) {
                const data = webhookData.data;
                const orderCode = Number(data.orderCode);

                // Lấy dữ liệu từ trong redis
                const temp = await checkoutRedis.getCheckoutTemp(orderCode);
                if (!temp) {
                    res.status(404).json({
                        message: `Data is not found${orderCode}`,
                    });
                }
                const {
                    fullname,
                    email,
                    phone,
                    address,
                    shippingMethod,
                    paymentMethod,
                    items,
                    total,
                } = temp;

                // Save Order
                await CheckOutProductModel.create({
                    fullname,
                    email,
                    phone,
                    address,
                    shippingMethod,
                    total: data.amount || total,
                    paymentMethod,
                    paymentStatus: 'paid',
                    orderStatus: 'confirmed',
                    orderId: `PAYOS_${orderCode}`,
                    orderCode,
                    paymentLink: data.paymentLinkId,
                    isReviewed: false,
                    items: items.map((item: ICheckOutItem) => ({
                        productId: item.productId,
                        userId: item.userId,
                        name: item.name,
                        image: item.image,
                        color: item.color,
                        size: item.size,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                });
                // Lưu xong xóa dữ liệu trong redis
                await checkoutRedis.deleteCheckoutTemp(orderCode);

                //Xóa product khỏi giỏ hàng
                try {
                    const conditions = items.map((item: ICheckOutItem) => ({
                        _id: item._id,
                        userId: item.userId,
                        productId: item.productId,
                        color: item.color,
                        size: item.size,
                    }));
                    await ItemCartModel.deleteMany({
                        $or: conditions,
                    });
                    res.status(200).json({ message: 'Delete Successfully' });
                } catch (error) {
                    console.log('Error:', error);
                }
            }
            return res.status(200).json({ message: 'SaveSuccessfully' });
        } catch (error) {
            console.error('Webhook error:', error);
            return res.status(200).json({ message: 'OK' });
        }
    };
}

export default new CheckOutController();
