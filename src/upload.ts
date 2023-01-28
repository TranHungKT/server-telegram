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
          cb(null, `pictures/${Date.now().toString()}${file.originalname}`);
        },
      }),
    });
  }
}

export const uploadServer = new UploadServer();

[
  {
    fileName: '6C4448A8-8B2A-4AD8-867D-E02AA6DF2E5C.jpg',
    fileSize: 45313,
    height: 256,
    type: 'image/jpg',
    uri: 'file:///Users/hung_tran/Library/Developer/CoreSimulator/Devices/27A55330-4757-447C-B437-A81BF76DA9C1/data/Containers/Data/Application/B90CA7DB-BAB0-4FEA-B507-3ABDB2BC1B2C/tmp/6C4448A8-8B2A-4AD8-867D-E02AA6DF2E5C.jpg',
    width: 144,
  },
  {
    fileName: '8201BD2C-741E-4FA2-9560-1F5937424B79.jpg',
    fileSize: 75900,
    height: 192,
    type: 'image/jpg',
    uri: 'file:///Users/hung_tran/Library/Developer/CoreSimulator/Devices/27A55330-4757-447C-B437-A81BF76DA9C1/data/Containers/Data/Application/B90CA7DB-BAB0-4FEA-B507-3ABDB2BC1B2C/tmp/8201BD2C-741E-4FA2-9560-1F5937424B79.jpg',
    width: 256,
  },
  {
    fileName: '9109A8BB-011E-4392-9F18-2141588E48DE.jpg',
    fileSize: 77305,
    height: 256,
    type: 'image/jpg',
    uri: 'file:///Users/hung_tran/Library/Developer/CoreSimulator/Devices/27A55330-4757-447C-B437-A81BF76DA9C1/data/Containers/Data/Application/B90CA7DB-BAB0-4FEA-B507-3ABDB2BC1B2C/tmp/9109A8BB-011E-4392-9F18-2141588E48DE.jpg',
    width: 192,
  },
  {
    fileName: '988AC5DC-4B35-4B6C-9DA7-39EC1F46BE2C.jpg',
    fileSize: 44546,
    height: 256,
    type: 'image/jpg',
    uri: 'file:///Users/hung_tran/Library/Developer/CoreSimulator/Devices/27A55330-4757-447C-B437-A81BF76DA9C1/data/Containers/Data/Application/B90CA7DB-BAB0-4FEA-B507-3ABDB2BC1B2C/tmp/988AC5DC-4B35-4B6C-9DA7-39EC1F46BE2C.jpg',
    width: 144,
  },
  {
    fileName: 'C0322187-780D-46B3-B8DF-F52E38962D00.jpg',
    fileSize: 66643,
    height: 256,
    type: 'image/jpg',
    uri: 'file:///Users/hung_tran/Library/Developer/CoreSimulator/Devices/27A55330-4757-447C-B437-A81BF76DA9C1/data/Containers/Data/Application/B90CA7DB-BAB0-4FEA-B507-3ABDB2BC1B2C/tmp/C0322187-780D-46B3-B8DF-F52E38962D00.jpg',
    width: 192,
  },
  {
    fileName: 'B9AE7873-9250-4631-B54A-3CE25CD34B1D.jpg',
    fileSize: 38849,
    height: 256,
    type: 'image/jpg',
    uri: 'file:///Users/hung_tran/Library/Developer/CoreSimulator/Devices/27A55330-4757-447C-B437-A81BF76DA9C1/data/Containers/Data/Application/B90CA7DB-BAB0-4FEA-B507-3ABDB2BC1B2C/tmp/B9AE7873-9250-4631-B54A-3CE25CD34B1D.jpg',
    width: 170,
  },
];
