import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials are not configured in environment variables');
}

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export const S3_CONFIG = {
  bucket: process.env.S3_BUCKET_NAME || '',
  region: process.env.AWS_REGION || 'us-west-1',
  uploadUrlExpiration: 600, // 15 minutes
  downloadUrlExpiration: 2000 // 1 hour
};
