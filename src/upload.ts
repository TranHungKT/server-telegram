import 'dotenv/config';
import multer from 'multer';
import multerS3 from 'multer-s3';

import { S3Client } from '@aws-sdk/client-s3';

export default class UploadServer {
  private s3: S3Client;
  public upload: multer.Multer;

  constructor() {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
      },
      region: process.env.S3_REGION || '',
    });
    this.upload = this.startUpload();
  }

  startUpload() {
    return this.initUploadMulter();
  }

  initUploadMulter() {
    return multer({
      storage: multerS3({
        s3: this.s3 as any,
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
  }
}

export const uploadServer = new UploadServer();
