import { s3Client } from '../src/config/s3config';
import { PutObjectCommand } from '@aws-sdk/client-s3';

async function testS3Connection() {
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: 'tritonscript-notes-bucket',
      Key: 'test.txt',
      Body: 'Connection test'
    }));
    
    console.log('✅ Successfully connected to AWS S3!');
  } catch (error) {
    console.error('❌ Failed to connect to S3:', error);
  }
}

testS3Connection();
