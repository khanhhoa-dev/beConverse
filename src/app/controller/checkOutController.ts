import { PayOS } from '@payos/node';
import { Request, Response, NextFunction } from 'express';

import { payosConfig } from '../../config/payos/payos';
import CheckOutProductModel from '../model/checkOutModel';
import type { IDataPayment } from '../model/checkOutModel';

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

class CheckOutController {
    createPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paymentData = req.body;

            const orderCode = Date.now();

            const body: IBodyPayos = {
                orderCode: orderCode,
                amount: paymentData.total,
                description: `#${orderCode}-${paymentData.fullname}`,
                items: paymentData.items.map((item: IDataPayment) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                returnUrl: `${payosConfig.returnUrl}?orderCode=${orderCode}`,
                cancelUrl: `${payosConfig.cancelUrl}?orderCode=${orderCode}`,
            };

            const paymentLink = await payos.paymentRequests.create(body);

            const orderToSave = {
                ...paymentData,
                orderId: `PAYOS_${orderCode}`,
                paymentLink: paymentLink.checkoutUrl,
                orderCode,
            };

            //Save Database
            await new CheckOutProductModel(orderToSave).save();
            res.status(200).json(paymentLink.checkoutUrl);
        } catch (error) {
            console.error('Checkout error:', error);
            next(error);
        }
    };
    webhook = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const webhookData = req.body;
            console.log('Webhook nhận được:', webhookData);
            if (webhookData.code === '00' && webhookData.success === true) {
                const orderCode = webhookData.orderCode;
                await CheckOutProductModel.findOneAndUpdate(
                    {
                        orderCode: Number(webhookData.data.orderCode),
                    },
                    {
                        status: 'paid',
                    },
                );
                console.log(`Đơn ${orderCode} đã thanh toán thành công!`);
            }
            return res.status(200).json({ message: 'Successfully!!!' });
        } catch (error) {
            console.log('Error:', error);
            next(error);
        }
    };
}

export default new CheckOutController();
