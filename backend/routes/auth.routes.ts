import express from 'express';
import {
  signup,
  signin,
  signout,
  signoutAll,
  google,
  refreshToken,
  getProfile,
  checkAuth,
  signupValidation,
  signinValidation
} from '../controllers/auth.controller';
import { 
  authenticate, 
  optionalAuth 
} from '../middleware/auth.middleware';
import { 
  authRateLimiter, 
  apiRateLimiter,
  sanitizeInput 
} from '../middleware/security.middleware';

const router = express.Router();

// Apply security middleware to all routes
router.use(sanitizeInput);

// Public routes with rate limiting
router.post('/signup', authRateLimiter, signupValidation, signup);
router.post('/signin', authRateLimiter, signinValidation, signin);
router.post('/google', authRateLimiter, google);
router.post('/refresh-token', apiRateLimiter, refreshToken);

// Protected routes (require authentication)
router.post('/signout', authenticate, signout);
router.post('/signout-all', authenticate, signoutAll);
router.get('/profile', authenticate, getProfile);
router.get('/check', authenticate, checkAuth);

// Optional auth routes (work with or without authentication)
router.get('/status', optionalAuth, (req, res) => {
  res.json({
    authenticated: !!req.user,
    user: req.user || null
  });
});

export default router;
