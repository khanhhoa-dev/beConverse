import { Request, Response, NextFunction } from 'express';

import ProductsModel from '../model/productsModel';

enum ProductType {
    Shoes = 'shoes',
    Clothing = 'clothing',
    Accessories = 'accessories',
}

interface IMatchStage {
    featured: boolean;
    product?: string;
}

class ProductsController {
    //[GET] /:product?style=style&type=type&gender=gender
    async product(req: Request, res: Response, next: NextFunction) {
        try {
            const { product } = req.params;
            const { style, type, gender, page = 1, limit = 8 } = req.query;

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

            //Skip:VD:Skip(10) thì nó sẽ bỏ qua 10 phần tử đầu tiên và limit(10) lấy thêm 10 phần tử tức là lấy từ 11->20
            const productData = await ProductsModel.find(dbQuery)
                .skip((pageNumber - 1) * limitNumber)
                .limit(limitNumber)
                .select('name image slug price product');

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
                    gender: ['male', 'female', 'unisex'],
                    style: ['chuck-70', 'classic-chuck', 'skate-elevation'],
                    type: ['high', 'low'],
                },
                clothing: {
                    gender: ['male', 'female', 'unisex'],
                    style: ['tops-tshirt', 'pants-shorts', 'jacket-hoodies'],
                    type: [
                        'tee',
                        'jacket',
                        'hoodies',
                        'short',
                        'pant',
                        'skirt',
                    ],
                },
                accessories: {
                    gender: ['male', 'female', 'unisex'],
                    style: ['bags-backpacks', 'hats', 'waist-bag', 'laces'],
                    type: ['hats', 'backpack', 'bag', 'others'],
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

    //[GET] : /products/featured?product=product
    async featured(req: Request, res: Response, next: NextFunction) {
        try {
            const { product } = req.query;
            const matchStage: IMatchStage = { featured: true };
            if (product) {
                matchStage.product = product as string;
            }

            const randomFeatured = await ProductsModel.aggregate([
                {
                    $match: matchStage,
                },
                { $sample: { size: 20 } },
                {
                    $project: {
                        name: 1,
                        price: 1,
                        slug: 1,
                        product: 1,
                        image: 1,
                        type: 1,
                    },
                },
            ]);
            res.json(randomFeatured);
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductsController();
