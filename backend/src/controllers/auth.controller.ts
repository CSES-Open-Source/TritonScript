import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { cp } from 'fs';

// generate a shorte lived token contains user id and email 
const generateShortAccessToken = (userId: string, email: string): string => {
    return jwt.sign(
        { _id: userId, ucsdEmail: email },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: '15m' } // short lived token
    );
};

const generateLongAccessToken = (userId: string): string => {
    return jwt.sign(
        { _id: userId },
        process.env.JWT_REFRESH_SECRET as string,
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
        console.log("Creating user account");

        const user = await User.create({
            ucsdEmail,
            firstName,
            lastName,
            password, 
        });
        console.log("User account created");

        const accessToken = generateShortAccessToken(user._id.toString(), user.ucsdEmail);
        const refreshToken = generateLongAccessToken(user._id.toString());

        console.log("Generated tokens");

        // Store refresh token in database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        console.log("Stored refresh token in database");


        // store refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        console.log("Stored refresh token in cookie");

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
    } catch (error: any) {  // Add type annotation for error
        res.status(500).json({
            message: 'Registration failed check auth controller',
            success: false,
            error: error.message 
        });
  }
}

export const login = async (req: AuthRequest, res: Response) : Promise<void> => {
    try {
        const { ucsdEmail, password } = req.body;
        
        const user = await User.findOne({ucsdEmail}).select('+password');
        console.log(`Attempting login for user: ${ucsdEmail}`);
        if (!user) {
            res.status(400).json({ 
                message: 'User not found', 
                success: false });
            return;
        }

        // if (user.isLocked()){
        //     res.status(423).json({ 
        //         message: 'Account is locked due to multiple failed login attempts. Please try again later in 2 hours', 
        //         success: false });
        //     return;
        // }

        // timie to check password
        console.log("Checking password", password);
        const isMatch = await user.comparePassword(password);
        console.log(`Password match status: ${isMatch}`);
        if (!isMatch) {
            await user.incrementLoginAttempts();
            res.status(400).json({ 
                message: 'Invalid email or password', 
                success: false });
            return;
        }

        // reset login attempts on successful login
        await user.resetLoginAttempts();
        
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

        res.status(200).json({
            message: 'Login successful',
            success: true,
            accessToken,
            data: {
                id: user._id,
                ucsdEmail: user.ucsdEmail,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        });

    }
    catch (error) {
        res.status(500).json({

            message: 'This error happending during login check login in auth controller',
            success: false
        });
    }
};

export const refreshAccessToken = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Get refresh token from cookie (not from request body - more secure)
      const { refreshToken } = req.cookies;
  
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: 'No refresh token found. Please login again.'
        });
        return;
      }
  
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { _id: string };
  
      // Find user and check if this refresh token matches
      const user = await User.findOne({
        _id: decoded._id,
        refreshToken: refreshToken  // Make sure it's the current one
      });
  
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token. Please login again.'
        });
        return;
      }
  
      // Generate NEW access token
      const newAccessToken = generateShortAccessToken(user._id.toString(), user.ucsdEmail);
  

      const newRefreshToken = generateLongAccessToken(user._id.toString());
      user.refreshToken = newRefreshToken;
      await user.save({ validateBeforeSave: false });
  
      // Update cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
  
      res.status(200).json({
        success: true,
        data: {
          accessToken: newAccessToken
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (req.user) {
        await User.findByIdAndUpdate(req.user._id, {
          $unset: { refreshToken: 1 }
        });
      }
  
      res.clearCookie('refreshToken');
      console.log("Cleared cookie and logged out")
  
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Logout failed check auth controller',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };


  export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: req.user._id,
            ucsdEmail: req.user.ucsdEmail,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            profilePicture: req.user.profilePicture
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
 





