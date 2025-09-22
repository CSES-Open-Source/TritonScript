import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import User from '../models/user.model';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Generate access token
export const generateAccessToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.expiresIn,
    issuer: 'tritonscript',
    audience: 'tritonscript-users'
  });
};

// Generate refresh token
export const generateRefreshToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, authConfig.jwt.refreshSecret, {
    expiresIn: authConfig.jwt.refreshExpiresIn,
    issuer: 'tritonscript',
    audience: 'tritonscript-users'
  });
};

// Generate both tokens
export const generateTokenPair = (user: any): TokenPair => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};

// Verify access token
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, authConfig.jwt.secret, {
      issuer: 'tritonscript',
      audience: 'tritonscript-users'
    }) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, authConfig.jwt.refreshSecret, {
      issuer: 'tritonscript',
      audience: 'tritonscript-users'
    }) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Store refresh token in database
export const storeRefreshToken = async (userId: string, refreshToken: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    $push: {
      refreshTokens: {
        token: refreshToken,
        createdAt: new Date()
      }
    }
  });
};

// Remove refresh token from database
export const removeRefreshToken = async (userId: string, refreshToken: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    $pull: {
      refreshTokens: { token: refreshToken }
    }
  });
};

// Remove all refresh tokens for a user (logout from all devices)
export const removeAllRefreshTokens = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    $set: { refreshTokens: [] }
  });
};

// Check if refresh token exists in database
export const isRefreshTokenValid = async (userId: string, refreshToken: string): Promise<boolean> => {
  const user = await User.findById(userId);
  if (!user) return false;
  
  return user.refreshTokens.some((tokenObj: any) => tokenObj.token === refreshToken);
};

// Clean up expired refresh tokens
export const cleanupExpiredTokens = async (): Promise<void> => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  await User.updateMany(
    {},
    {
      $pull: {
        refreshTokens: {
          createdAt: { $lt: sevenDaysAgo }
        }
      }
    }
  );
};
