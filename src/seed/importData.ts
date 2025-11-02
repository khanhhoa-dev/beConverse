import mongoose from 'mongoose';
import ProductsModel from '../app/model/productsModel';
import fs from 'fs';
import path from 'path';

const MONGO_URI = 'mongodb://localhost:27017/website_converse_dev';

async function connectDb() {
    try {
        await mongoose.connect(MONGO_URI);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
    }
}

async function importDb() {
    try {
        await connectDb();
        const filePath = path.join(__dirname, '../data/products.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        await ProductsModel.deleteMany({});
        console.log('🧹 Old data cleared');

        for (const item of data) {
            const product = new ProductsModel(item);
            await product.save();
        }
        process.exit();
    } catch (error) {
        console.error('❌ Error importing data:', error);
    }
}

importDb();
