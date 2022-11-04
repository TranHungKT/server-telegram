import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';

import { verifyTokenMiddlewares } from '@Middlewares';
import { S3Client } from '@aws-sdk/client-s3';

const imageRouter = express.Router();

const s3 = new S3Client({
  credentials: {
    accessKeyId: 'AKIATROZHFGNOI6M7CVR',
    secretAccessKey: '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',
  },
  region: 'ap-southeast-1',
});

const upload = multer({
  storage: multerS3({
    s3: s3 as any,
    acl: 'public-read',
    bucket: 'telegram-tran-hung-ver-2',
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
