import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import noteRoutes from './routes/note';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import catalogRoutes from './routes/catalog';
import fileUpload from 'express-fileupload';
import cors from 'cors';

const app: Application = express();
const PORT: string | number = process.env.PORT || 5005;

// Middleware
app.use(express.json());
app.options('*', cors());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/api/notes', noteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/', catalogRoutes);

// Start server (Prisma connects lazily on first query)
app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`);
});
