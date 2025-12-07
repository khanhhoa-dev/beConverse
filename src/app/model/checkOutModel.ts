import mongoose, { Schema, model } from 'mongoose';

export interface ICheckOutItem {
    _id: string;
    productId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    name: string;
    image: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
}

export interface IDataPayment extends ICheckOutItem {
    fullname: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: string;
    shippingMethod: string;
    total: number;
    items: ICheckOutItem[];
    paymentStatus?: string;
    orderId: string;
    orderCode: number;
    paymentLink: string;
}

const CheckOutSchema = new Schema<ICheckOutItem>({
    _id: { type: String, require: true },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

const CheckOutProductSchema = new Schema<IDataPayment>(
    {
        fullname: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        shippingMethod: { type: String, required: true },
        total: { type: Number, required: true },
        paymentMethod: {
            type: String,
            enum: ['payos', 'cod'],
            default: 'payos',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        items: [CheckOutSchema],
        orderId: { type: String, unique: true },
        orderCode: { type: Number, required: true, index: true },
        paymentLink: { type: String },
    },
    { timestamps: true },
);

const CheckOutProductModel = model('CheckoutProduct', CheckOutProductSchema);

export default CheckOutProductModel;
