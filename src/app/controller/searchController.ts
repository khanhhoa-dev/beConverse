import { Request, Response, NextFunction } from 'express';

import ProductsModel from '../model/productsModel';

class SearchController {
    //[GET] /search/product?name=name
    async show(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.query;
            if (!name) {
                res.status(404).json({ message: 'Name not found' });
            }

            // Tạo ra một biểu thức chính quy để thực hiện  tìm kiếm không phân biệt theo chữ hoa và chữ thường
            const regex = new RegExp(name as string, 'i');
            const product = await ProductsModel.find({ name: regex })
                .limit(5)
                .select('name slug image price'); // Lấy ra những field cần thiết
            res.json(product);
        } catch (error) {
            next(error);
        }
    }
}

export default new SearchController();
