import User, { AuthProvider, UserRole } from "../models/user.model";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error";
import { Request, Response, NextFunction } from "express";
import { 
  generateTokenPair, 
  storeRefreshToken, 
  removeRefreshToken, 
  removeAllRefreshTokens,
  verifyRefreshToken,
  isRefreshTokenValid 
} from "../utils/jwt.utils";
import { authConfig } from "../config/auth.config";
import { body, validationResult } from 'express-validator';

// Validation rules for signup
export const signupValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(409).json({
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Hash password with configured rounds
    const hashedPassword = bcryptjs.hashSync(password, authConfig.bcrypt.rounds);
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      authProvider: AuthProvider.LOCAL
    });

    await newUser.save();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(newUser);
    
    // Store refresh token
    await storeRefreshToken(newUser._id.toString(), refreshToken);
    
    // Set secure cookies
    const cookieOptions = {
      httpOnly: true,
      secure: authConfig.security.nodeEnv === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refresh_token', refreshToken, cookieOptions);
    
    // Return user data (excluding sensitive info)
    const { password: _, refreshTokens, ...userResponse } = newUser.toObject();
    
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      accessToken // Also return in body for mobile apps
    });
    
  } catch (error) {
    next(error);
  }
}

// Validation rules for signin
export const signinValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export async function signin(req: Request, res: Response, next: NextFunction) {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;
    
    // Find user and include password for verification
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        error: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }
    
    // Verify password
    const isValidPassword = bcryptjs.compareSync(password, user.password);
    
    if (!isValidPassword) {
      // Increment failed login attempts
      await user.incLoginAttempts();
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Reset login attempts on successful login
    await user.resetLoginAttempts();
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user);
    
    // Store refresh token
    await storeRefreshToken(user._id.toString(), refreshToken);
    
    // Set secure cookies
    const cookieOptions = {
      httpOnly: true,
      secure: authConfig.security.nodeEnv === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refresh_token', refreshToken, cookieOptions);
    
    // Return user data (excluding sensitive info)
    const { password: _, refreshTokens, loginAttempts, lockUntil, ...userResponse } = user.toObject();
    
    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      accessToken // Also return in body for mobile apps
    });
    
  } catch (error) {
    next(error);
  }
}

// Refresh token endpoint
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies.refresh_token;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not provided' });
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Check if refresh token exists in database
    const isValid = await isRefreshTokenValid(decoded.id, refreshToken);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Get fresh user data
    const user = await User.findById(decoded.id);
    if (!user || user.isLocked) {
      return res.status(401).json({ error: 'User not found or account locked' });
    }
    
    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user);
    
    // Remove old refresh token and store new one
    await removeRefreshToken(user._id.toString(), refreshToken);
    await storeRefreshToken(user._id.toString(), newRefreshToken);
    
    // Set new cookies
    const cookieOptions = {
      httpOnly: true,
      secure: authConfig.security.nodeEnv === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refresh_token', newRefreshToken, cookieOptions);
    
    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken
    });
    
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}

export async function google(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, photo } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google authentication' });
    }
    
    let user = await User.findOne({ email });
    
    if (user) {
      // Existing user - update auth provider if needed
      if (user.authProvider !== AuthProvider.GOOGLE) {
        user.authProvider = AuthProvider.GOOGLE;
        user.profilePicture = photo || user.profilePicture;
        await user.save();
      }
      
      // Reset login attempts on successful OAuth login
      await user.resetLoginAttempts();
    } else {
      // Create new user
      const username = name
        ? name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4)
        : email.split('@')[0] + Math.random().toString(36).slice(-4);
      
      user = new User({
        username,
        email,
        profilePicture: photo,
        authProvider: AuthProvider.GOOGLE,
        isVerified: true, // Google accounts are pre-verified
        // No password needed for OAuth users
      });
      
      await user.save();
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user);
    
    // Store refresh token
    await storeRefreshToken(user._id.toString(), refreshToken);
    
    // Set secure cookies
    const cookieOptions = {
      httpOnly: true,
      secure: authConfig.security.nodeEnv === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    
    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refresh_token', refreshToken, cookieOptions);
    
    // Return user data (excluding sensitive info)
    const { password, refreshTokens, loginAttempts, lockUntil, ...userResponse } = user.toObject();
    
    res.status(200).json({
      message: 'Google authentication successful',
      user: userResponse,
      accessToken
    });
    
  } catch (error) {
    next(error);
  }
}

export async function signout(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies.refresh_token;
    const userId = req.user?.id; // From auth middleware
    
    // Remove refresh token from database if available
    if (refreshToken && userId) {
      await removeRefreshToken(userId, refreshToken);
    }
    
    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    res.status(200).json({ message: 'Signout successful' });
  } catch (error) {
    next(error);
  }
}

// Sign out from all devices
export async function signoutAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Remove all refresh tokens for this user
    await removeAllRefreshTokens(userId);
    
    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    res.status(200).json({ message: 'Signed out from all devices' });
  } catch (error) {
    next(error);
  }
}

// Get current user profile
export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await User.findById(userId).select('-password -refreshTokens');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

// Check authentication status
export async function checkAuth(req: Request, res: Response) {
  // This endpoint uses the authenticate middleware
  // If we reach here, the user is authenticated
  res.status(200).json({ 
    authenticated: true, 
    user: req.user 
  });
}
