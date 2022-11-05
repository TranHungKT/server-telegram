import express from 'express';

import { getMessagesController } from '@Controllers/messageControllers';
import { verifyTokenMiddlewares } from '@Middlewares';

const messageRouters = express.Router();

messageRouters.get(
  '/list-message',
  verifyTokenMiddlewares,
  getMessagesController,
);

export { messageRouters };
