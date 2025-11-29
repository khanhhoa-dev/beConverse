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
            const deleteUser = await UserModel.findById({ _id: id });
            res.status(200).json('Delete user successfully!');
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
