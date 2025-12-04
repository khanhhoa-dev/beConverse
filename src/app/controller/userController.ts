import { Request, Response, NextFunction } from 'express';

import UserModel from '../model/userModel';

class UserController {
    // [GET]: /users/
    async userAll(req: Request, res: Response, next: NextFunction) {
        try {
            const userAll = await UserModel.find();
            res.status(200).json(userAll);
        } catch (error) {
            next(error);
        }
    }

    //[DELETE]: /users/:id
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleteUser = await UserModel.findByIdAndDelete({ _id: id });
            res.status(200).json(deleteUser);
        } catch (error) {
            next(error);
        }
    }

    //[PATCH]: /users/update-role/:id
    updateRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { data } = req.body;
            const { id } = req.params;
            if (typeof data !== 'boolean')
                return res
                    .status(400)
                    .json({ message: 'Data must be boolean' });
            const updateRole = await UserModel.findByIdAndUpdate(
                { _id: id },
                { admin: data },
                { new: true },
            );
            if (!updateRole) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ updateRole });
        } catch (error) {
            next(error);
        }
    };
}

export default new UserController();
