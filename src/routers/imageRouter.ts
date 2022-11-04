import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';

import { verifyTokenMiddlewares } from '@Middlewares';
import { S3Client } from '@aws-sdk/client-s3';

const imageRouter = express.Router();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  region: 'ap-southeast-1',
});

const upload = multer({
  storage: multerS3({
    s3: s3 as any,
    acl: 'public-read',
    bucket: process.env.S3_BUCKET_NAME || '',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `pictures/${Date.now().toString()}`);
    },
  }),
});

imageRouter.post(
  '/upload-photo',
  verifyTokenMiddlewares,
  upload.single('photos'),
  (req, res) => {
    return res.status(200).send({ fileUrl: (req.file as any).location });
  },
);

export { imageRouter };
