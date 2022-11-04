import cors from 'cors';
import 'dotenv/config';
import express, { Express } from 'express';
import { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import http from 'http';
import 'module-alias/register';
import multer from 'multer';
import multerS3 from 'multer-s3';
import passport from 'passport';

import { initDb } from '@Configs';
import { CustomError } from '@Utils';
import { S3Client } from '@aws-sdk/client-s3';

import { verifyTokenMiddlewares } from './middlewares/verifyTokenMiddlewares';
import { router } from './routers';
import SocketServer from './socket';

const PORT = process.env.PORT || 3000;

export default class App {
  private server: Express;
  private app: http.Server;
  private s3: S3Client;
  private upload: any;

  constructor() {
    this.server = express();
    this.app = http.createServer(this.server);
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
      },
      region: 'ap-southeast-1',
    });
  }

  private async initServer() {
    this.upload = await this.initUploadMulter();

    this.server.use(cors());
    this.server.use(
      session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SECRET_SESSION || 'secret',
      }),
    );

    initDb();

    this.server.use(passport.initialize());
    this.server.use(passport.session());

    this.server.use(express.json());

    this.server.use(router);

    this.server.post(
      '/upload-photo',
      verifyTokenMiddlewares,
      this.upload.single('photos'),
      (req, res) => {
        return res.status(200).send({ fileUrl: (req.file as any).location });
      },
    );

    this.server.use(
      (error: Error, req: Request, res: Response, _: NextFunction) => {
        if (error instanceof CustomError) {
          return res
            .status(error.statusCode)
            .send({ error: error.serializeErrors() });
        }

        console.log(error);
        return res.status(400).send({
          error: [
            {
              message: 'Something went wrong',
            },
          ],
        });
      },
    );
  }

  async initSocketServer() {
    const socket = new SocketServer(this.app);
    socket.connectSocket();
  }

  async initUploadMulter() {
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

  async start() {
    await this.initServer();
    await this.initSocketServer();

    this.app.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`),
    );
  }
}

const app = new App();

app.start();
