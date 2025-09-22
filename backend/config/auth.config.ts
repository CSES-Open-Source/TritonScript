import dotenv from 'dotenv';

dotenv.config();

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRE || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  security: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  ucsd: {
    ssoEntityId: process.env.UCSD_SSO_ENTITY_ID || '',
    ssoUrl: process.env.UCSD_SSO_SSO_URL || '',
    ssoCert: process.env.UCSD_SSO_CERT || '',
  },
};

// Validation function to ensure required environment variables are set
export function validateAuthConfig() {
  const requiredVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using fallback values - NOT SECURE for production!');
  }
  
  if (process.env.NODE_ENV === 'production' && missing.length > 0) {
    throw new Error(`Production requires these environment variables: ${missing.join(', ')}`);
  }
}
