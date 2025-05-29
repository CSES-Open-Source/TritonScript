import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import noteRoutes from './routes/note';
import multer from 'multer';
import fileUpload from 'express-fileupload';
import cors from 'cors';

const app: Application = express();

// Middleware
// Middleware to parse form data (without files)
app.use(express.json());
app.options('*', cors()); // Allow preflight requests

app.use(cors({
    origin: 'http://localhost:5173', // Allow frontend URL
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  }));

//files
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("Headers:", req.headers);

    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/api/notes', noteRoutes);

// Connect to database
const CONNECTION_URL: string | undefined = process.env.CONNECTION_URL;
const PORT: string | number = process.env.PORT || 5005;

if (!CONNECTION_URL) {
    console.error('Database connection URL is not defined in environment variables.');
    process.exit(1);
}

mongoose.connect(CONNECTION_URL)
    .then(() => {
        console.log('Connected to database');
        app.listen(PORT, () => {
            console.log(`Listening forr requests on port ${PORT}`);
        });
    })
    .catch((err: Error) => {
        console.error('Database connection error:', err);
});

