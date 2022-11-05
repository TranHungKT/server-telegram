import express from 'express';

import { verifyTokenMiddlewares } from '@Middlewares';

import { uploadServer } from '../upload';

const fileRouters = express.Router();

fileRouters.post(
  '/upload-image',
  verifyTokenMiddlewares,
  uploadServer.upload.single('photos'),
  (req, res) => {
    return res.status(200).send({ fileUrl: (req.file as any).location });
  },
);

export { fileRouters };
