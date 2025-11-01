import mongoose from 'mongoose';

const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(
            'mongodb://localhost:27017/website_converse_dev',
        );
        console.log('✅ Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error);
    }
};

export default { connect };
