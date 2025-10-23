import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// generate a shorte lived token contains user id and email 
const generateShortAccessToken = (userId: string, email: string): string => {
    return jwt.sign(
        { _id: userId, ucsdEmail: email },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' } // short lived token
    );
};

const generateLongAccessToken = (userId: string): string => {
    return jwt.sign(
        { _id: userId },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' } // long lived token
    );
};

// Sign up user account
export const register = async (req: AuthRequest, res: Response) : Promise<void> => {
    try{
        const { ucsdEmail, firstName, lastName, password } = req.body;

        // check if user exists
        const existingUser = await User.findOne({ ucsdEmail });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            ucsdEmail,
            firstName,
            lastName,
            password, 
        });

        const accessToken = generateShortAccessToken(user._id.toString(), user.ucsdEmail);
        const refreshToken = generateLongAccessToken(user._id.toString());

        // Store refresh token in database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // store refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: 'User registered successfully',
            success: true,
            accessToken,
            user: {
                _id: user._id,
                ucsdEmail: user.ucsdEmail,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}
//TODO: add login, logout, refresh token functions here



