import 'express';

export interface UserJwtPayload {
    id: string;
    admin: boolean;
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserJwtPayload;
        }
    }
}

export {};
