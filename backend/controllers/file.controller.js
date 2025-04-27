// controllers/file.controller.js

const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Uploads a single file buffer to S3 and returns the file URL.
 * @param {object} file      – should have `.data` (Buffer) and `.mimetype`
 * @param {string} bucketName
 * @returns {Promise<string>} the S3 URL of the uploaded file
 */
async function uploadToS3(file, bucketName) {
  try {
    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const extension = file.mimetype.split('/')[1];
    const newFileName = `pic_${Date.now().toString()}.${extension}`;

    const params = {
      Bucket: bucketName,
      Key: newFileName,
      Body: file.data,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.error('S3 upload error:', err);
          return reject(err);
        }
        resolve(data.Location);
      });
    });
  } catch (err) {
    console.error('uploadToS3 caught error:', err);
    throw err;
  }
}

/**
 * Express handler to receive `req.files.file` and upload it to S3.
 */
async function uploadFile(req, res) {
  try {
    const file = req.files && req.files.file;
    if (!file || !file.name) {
      return res.status(400).json({ success: false, message: 'No file provided.' });
    }

    const url = await uploadToS3(file, process.env.AWS_S3_BUCKET);
    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      url,
    });
  } catch (err) {
    console.error('uploadFile error:', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during file upload.',
    });
  }
}

module.exports = {
  uploadToS3,
  uploadFile,
};
