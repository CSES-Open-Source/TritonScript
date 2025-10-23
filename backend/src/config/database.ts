import mongoose from 'mongoose';

export const connectDB = async (mongoUri: string): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDBBBBB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};