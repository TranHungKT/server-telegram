import express from 'express';
import { map } from 'lodash';

import { verifyTokenMiddlewares } from '@Middlewares';

import { uploadServer } from '../upload';

const fileRouters = express.Router();

fileRouters.post(
  '/upload-image',
  verifyTokenMiddlewares,
  uploadServer.upload.array('photos'),
  (req, res) => {
    return res
      .status(200)
      .send({ fileUrls: map(req.files as any, 'location') });
  },
);

export { fileRouters };
