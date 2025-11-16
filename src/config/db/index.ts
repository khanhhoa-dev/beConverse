import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connect = async (): Promise<void> => {
    try {
        const uri =
            process.env.MONGODB_URI ||
            'mongodb://localhost:27017/website_converse_dev';
        await mongoose.connect(uri);
        console.log(
            '✅ Kết nối MongoDB thành công! URI:',
            uri.includes('localhost') ? 'Local' : 'Atlas',
        );
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error);
    }
};

export default { connect };
