import dotenv from 'dotenv';
dotenv.config(); // ✅ Make sure this is at the top
import cors from 'cors';

import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import noteRoutes from './routes/note';
import multer from 'multer';

const app: Application = express();

// ✅ Debugging: Print environment variables
console.log("Loaded Connection URL:", process.env.CONNECTION_URL);

// ✅ Define Multer storage (stores files in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ CORS Middleware (Added Here)
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend requests
  credentials: true, // Allow cookies and authentication headers
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));

// Middleware
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("Headers:", req.headers);
    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/api/notes', noteRoutes);

// Connect to database
const CONNECTION_URL: string | undefined = process.env.CONNECTION_URL;
const PORT: string | number = process.env.PORT || 5004;

if (!CONNECTION_URL) {
    console.error('❌ Database connection URL is missing. Check your .env file.');
    process.exit(1);
}

mongoose.connect(CONNECTION_URL)
    .then(() => {
        console.log('✅ Connected to database');
        app.listen(PORT, () => {
            console.log(`🚀 Listening for requests on port ${PORT}`);
        });
    })
    .catch((err: Error) => {
        console.error('❌ Database connection error:', err);
    });

export { upload };
