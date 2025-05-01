// routes/upload.js
const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'your-region',
});

router.get('/get-presigned-url', (req, res) => {
  const { fileName, fileType } = req.query;

  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${Date.now()}-${fileName}`,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read', // or private
  };

  s3.getSignedUrl('putObject', s3Params, (err, url) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Could not generate URL' });
    }

    res.json({
      uploadUrl: url,
      key: s3Params.Key,
    });
  });
});

module.exports = router;
