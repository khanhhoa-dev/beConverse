import mongoose, { Schema, model, Document } from 'mongoose';

export interface IItemCart extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    name: string;
    price: string;
    quantity: number;
    color: string;
    image: string;
    size: string;
}

const ItemCartSchema = new Schema<IItemCart>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        name: { type: String, required: true },
        price: { type: String, required: true },
        quantity: { type: Number, required: true },
        color: { type: String, required: true },
        image: { type: String, required: true },
        size: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

const ItemCartModel = model('ItemCart', ItemCartSchema);

export default ItemCartModel;
