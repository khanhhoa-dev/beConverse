import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

import UserModel from '../model/userModel';
import type { UserJwtPayload } from '../../types/express';
import {
    storeRefreshToken,
    verifyAndConsumeRefreshToken,
    blacklistAllTokenOfUser,
} from '../../utils/tokenStorage';

class AuthController {
    // Generate AccessToken
    generateAccessToken = (payload: UserJwtPayload) => {
        return jwt.sign(
            {
                id: payload.id,
                admin: payload.admin,
            },
            process.env.JWT_ACCESS_KEY!,
            {
                expiresIn: '30s',
            },
        );
    };

    //Generate RefreshToke
    generateRefreshToken = (user: UserJwtPayload) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
                jti: crypto.randomUUID(),
            },
            process.env.JWT_REFRESH_KEY!,
            {
                expiresIn: '7d',
            },
        );
    };

    // [POST]: auth/register
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                firstname,
                lastname,
                gender,
                username,
                email,
                phonenumber,
                password,
            } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            const newUser = await new UserModel({
                firstname,
                lastname,
                gender,
                username,
                email,
                phonenumber,
                password: hashed,
            });
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    };

    // [POST]: auth/login
    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
            const user = await UserModel.findOne({
                username,
            });
            if (!user) {
                return res
                    .status(404)
                    .json({ field: 'username', message: 'Wrong username' });
            }

            const validPassword = await bcrypt.compare(
                password,
                user?.password,
            );
            if (!validPassword) {
                return res
                    .status(401)
                    .json({ field: 'password', message: 'Wrong password' });
            }
            if (user && validPassword) {
                const payload = {
                    id: user.id,
                    admin: user.admin || false,
                };

                const accessToken = this.generateAccessToken(
                    payload as UserJwtPayload,
                );
                const refreshToken = this.generateRefreshToken(
                    payload as UserJwtPayload,
                );

                await storeRefreshToken(payload.id, refreshToken, 7);

                //Login thành công sẽ lưu refresh trên cookie
                res.cookie('refreshToken', refreshToken, {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...others } = user.toObject();
                return res.status(200).json({ ...others, accessToken });
            }
        } catch (error) {
            next(error);
        }
    };

    //[POST] /auth/refresh
    refresh = async (req: Request, res: Response, next: NextFunction) => {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            return res
                .status(401)
                .json({ message: 'You have not authenticated' });
        }
        try {
            const decoded = (await jwt.verify(
                oldRefreshToken,
                process.env.JWT_REFRESH_KEY!,
            )) as UserJwtPayload;

            await verifyAndConsumeRefreshToken(oldRefreshToken, decoded.id);

            const payload = {
                id: decoded.id,
                admin: decoded.admin,
            };

            const newAccessToken = this.generateAccessToken(
                payload as UserJwtPayload,
            );
            const newRefreshToken = this.generateRefreshToken(
                payload as UserJwtPayload,
            );

            await storeRefreshToken(payload.id, newRefreshToken, 7);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'none',
            });
            res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            res.status(403).json({ message: 'Invalid refresh token' });
            next(error);
        }
    };
    //[POST]: auth/logout
    logout = async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (userId) {
            await blacklistAllTokenOfUser(userId as string);
        }
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logout Successfully!' });
    };
}

export default new AuthController();
