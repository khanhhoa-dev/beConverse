import slug from 'mongoose-slug-updater';
import mongoose, { Schema, model, Document } from 'mongoose';

interface IVariant extends Document {
    color: string;
    img: string;
    size: string[];
    quantity: number;
}

export interface IProducts extends Document {
    name: string;
    price: number;
    gt_price?: number;
    gender: 'male' | 'female' | 'unisex';
    style_shoes: 'high' | 'low';
    type: string;
    description: string;
    slug: string;
    category: string;
    featured: boolean;
    background: string;
    variant: IVariant[]; //là một mảng chứa các phần tử kiểu IVariant
}

//Schema
const Variant = new Schema<IVariant>({
    color: { type: String, required: true },
    img: { type: String, required: true },
    size: [{ type: String }],
    quantity: { type: Number, required: true, min: 0 },
});
const ProductsSchema = new Schema<IProducts>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        gt_price: { type: Number, min: 0 },
        gender: {
            type: String,
            enum: ['male', 'female', 'unisex'],
            required: true,
        },
        style_shoes: { type: String, enum: ['high', 'low'], required: true },
        type: { type: String, required: true },
        description: { type: String, required: true },
        slug: { type: String, slug: 'name', unique: true },
        category: { type: String, required: true },
        featured: { type: Boolean, default: false },
        background: { type: String, required: true },
        variant: [Variant],
    },
    {
        timestamps: true,
    },
);

mongoose.plugin(slug);

//Model
const ProductsModel = model('Product', ProductsSchema);
export default ProductsModel;
