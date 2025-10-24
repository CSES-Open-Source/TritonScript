import express from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe
} from '../controllers/auth.controller';
import { auth } from '../middleware/auth';
import { validateUCSDEmail } from '../middleware/validateUCSD';

const router = express.Router();

// Public routes (anyone can access)
router.post('/register', validateUCSDEmail, register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);

// Protected routes (must be logged in)
router.post('/logout', auth, logout);  // auth middleware runs first
router.get('/me', auth, getMe);

export default router;
