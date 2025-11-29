import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import type { UserJwtPayload } from '../../types/express/index';

class VerifyToken {
    //Verify Toke
    verify = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.token as string;
        if (!token) {
            return res.status(401).json('You have not authenticated');
        }
        const accessToken = token?.includes('Bearer ')
            ? token.split(' ')[1]
            : token;
        try {
            const user = (await jwt.verify(
                accessToken,
                process.env.JWT_ACCESS_KEY!,
            )) as UserJwtPayload;
            req.user = user;
            next();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return res.status(403).json('Token is not valid');
        }
    };

    // 2. Verify Admin (admin only)
    verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
        await this.verify(req, res, () => {
            if (!req.user?.admin) {
                return res.status(403).json({ message: 'Require Admin Role!' });
            }
            next();
        });
    };

    // 3. Verify Owner OR Admin
    verifyOwnerAndAdmin = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        this.verify(req, res, () => {
            if (req.user?.id === req.params.id || req.user?.admin) {
                next();
            } else {
                return res
                    .status(403)
                    .json({ message: 'You have not allowed' });
            }
        });
    };
}

export default new VerifyToken();
