import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import noteRoutes from './routes/note';
import authRoutes from './routes/auth.routes';
import fileUpload from 'express-fileupload';
import { authConfig, validateAuthConfig } from './config/auth.config';
import { securityHeaders, corsOptions, requestLogger } from './middleware/security.middleware';

// Validate configuration before starting server
validateAuthConfig();

const app: Application = express();

// Security middleware (apply first)
app.use(securityHeaders);
app.use(requestLogger);

// CORS configuration
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  abortOnLimit: true,
  responseOnLimit: 'File size limit exceeded'
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: authConfig.security.nodeEnv
  });
});

// Connect to database
const MONGODB_URI: string = process.env.MONGODB_URI || process.env.CONNECTION_URL || 'mongodb://localhost:27017/tritonscript';
const PORT: string | number = process.env.PORT || authConfig.security.nodeEnv === 'production' ? 3001 : 5005;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('🗄️  Connected to MongoDB database');
        console.log('🔐 Authentication system initialized');
        
        app.listen(PORT, () => {
            console.log(`🚀 TritonScript server running on port ${PORT}`);
            console.log(`🌍 Environment: ${authConfig.security.nodeEnv}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        });
    })
    .catch((err: Error) => {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    });

