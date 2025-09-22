import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt.utils';
import { UserRole, IUser } from '../models/user.model';
import User from '../models/user.model';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { isUcsdStudent?: boolean };
    }
  }
}

// Authentication middleware - verifies JWT token
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = verifyAccessToken(token);
    
    // Fetch fresh user data to ensure account is still active
    const user = await User.findById(decoded.id).select('-password -refreshTokens');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Access denied. User not found.' 
      });
    }

    if (user.isLocked) {
      return res.status(423).json({ 
        error: 'Account is temporarily locked due to too many failed login attempts.' 
      });
    }

    // Add user info to request object
    req.user = {
      ...decoded,
      isUcsdStudent: user.isUcsdStudent
    };

    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Access denied. Invalid token.' 
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('-password -refreshTokens');
      
      if (user && !user.isLocked) {
        req.user = {
          ...decoded,
          isUcsdStudent: user.isUcsdStudent
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Authorization middleware - checks user roles
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access denied. Authentication required.' 
      });
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// UCSD student verification middleware
export const requireUcsdStudent = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Access denied. Authentication required.' 
    });
  }

  if (!req.user.isUcsdStudent) {
    return res.status(403).json({ 
      error: 'Access denied. UCSD student verification required.' 
    });
  }

  next();
};

// Resource ownership middleware - ensures user can only access their own resources
export const requireOwnership = (userIdParam: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access denied. Authentication required.' 
      });
    }

    const resourceUserId = req.params[userIdParam];
    
    // Admins can access any resource
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    // Users can only access their own resources
    if (req.user.id !== resourceUserId) {
      return res.status(403).json({ 
        error: 'Access denied. You can only access your own resources.' 
      });
    }

    next();
  };
};
