import slug from 'mongoose-slug-updater';
import mongoose, { Schema, model, Document } from 'mongoose';

interface IVariant extends Document {
    color: string;
    img_detail: string;
    size: string[];
    quantity: number;
}

export interface IProducts extends Document {
    name: string;
    price: string;
    gender: 'Male' | 'Female' | 'Unisex';
    title: string;
    image: string;
    style: string;
    type: string;
    product: string;
    description: string;
    slug: string;
    featured: boolean;
    variant: IVariant[]; //là một mảng chứa các phần tử kiểu IVariant
}

//Schema
const Variant = new Schema<IVariant>({
    color: { type: String, required: true },
    img_detail: { type: String, required: true },
    size: [{ type: String }],
    quantity: { type: Number, required: true, min: 0 },
});
const ProductsSchema = new Schema<IProducts>(
    {
        name: { type: String, required: true },
        price: { type: String, required: true, min: 0 },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Unisex'],
            required: true,
        },
        title: { type: String, required: true },
        image: { type: String, required: true },
        style: { type: String, required: true },
        type: { type: String, required: true },
        product: { type: String, required: true },
        description: { type: String, required: true },
        slug: { type: String, slug: 'name', unique: true },
        featured: { type: Boolean, default: false },
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
