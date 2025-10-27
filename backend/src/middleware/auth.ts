import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/User';

export interface AuthRequest extends Request {
    user?: IUserDocument; // Attach user document to request
}

// data stored inside jwt
interface DecodedToken {
    _id: string;
    ucsdEmail: string;
    iat: number; // issued at
    exp: number; // expiration
}

// authenticate middleware
export const auth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authorization header missing or malformed' });
            return;
        }
        console.log("Remove bearer now")
        const token = authHeader.replace('Bearer ', '');

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET as string 
        ) as DecodedToken;

        const user = await User.findById(decoded._id);
        console.log("User found is "+user)
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        req.user = user;
        console.log("Done with user auth going next now")
        next();
    } catch (err) {
        // if invalid token
        if (err instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        } else if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token has expired' });
            return;
        } else {
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
    }
};
