import { Request, Response, NextFunction } from 'express';

import ProductsModel from '../model/productsModel';

enum ProductType {
    Shoes = 'shoes',
    Clothing = 'clothing',
    Accessories = 'accessories',
}

class ProductsController {
    //[GET] /:product?style=style&type=type&gender=gender
    async product(req: Request, res: Response, next: NextFunction) {
        try {
            const { product } = req.params;
            const { style, type, gender, page = 1, limit = 10 } = req.query;

            // validTypes k phải là object mà đang là một SetObject
            const validTypes = new Set(Object.values(ProductType));
            if (!validTypes.has(product as ProductType)) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Build query explicit để log rõ
            const dbQuery: any = { product };
            if (style) dbQuery.style = style;
            if (type) dbQuery.type = type;
            if (gender) dbQuery.gender = gender;

            //Chuyển query sang số
            const pageNumber = Number(page);
            const limitNumber = Number(limit);

            //Đếm tổng số bản ghi khớp
            const total = await ProductsModel.countDocuments(dbQuery);
            console.log(total);

            //Skip:VD:Skip(10) thì nó sẽ bỏ qua 10 phần tử đầu tiên và limit(10) lấy thêm 10 phần tử tức là lấy từ 11->20
            const productData = await ProductsModel.find(dbQuery)
                .skip((pageNumber - 1) * limitNumber)
                .limit(limitNumber);

            res.status(200).json({
                total,
                page: pageNumber,
                totalPages: Math.ceil(total / limitNumber),
                products: productData,
            });
        } catch (error) {
            console.error('Query error:', error);
            next(error);
        }
    }

    //[GET] /:product/filter
    async filter(req: Request, res: Response, next: NextFunction) {
        try {
            const { product } = req.params;
            const filter: Record<string, any> = {
                shoes: {
                    style: ['Chuck-70', 'Classic-Chuck', 'Skate-Elevation'],
                    gender: ['Male', 'Female', 'Unisex'],
                    type: ['High', 'Low'],
                },
                clothing: {
                    style: ['Tops-Tshirt', 'Pants-Shorts', 'Jacket-Hoodies'],
                    gender: ['Male', 'Female', 'Unisex'],
                    type: [
                        'Tee',
                        'Jacket',
                        'Hoodies',
                        'Short',
                        'Pant',
                        'Skirt',
                    ],
                },
                accessories: {
                    style: ['Bags-BackPacks', 'Hats', 'Waist Bag', 'Laces'],
                    gender: ['Male', 'Female', 'Unisex'],
                    type: ['Hats', 'Backpack', 'Bag', 'Others'],
                },
            };
            const data = filter[product];
            if (!data)
                return res
                    .status(404)
                    .json({ message: 'Product type not found' });
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductsController();
