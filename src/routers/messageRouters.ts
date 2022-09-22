import express from 'express';

import { getMessagesController } from '@Controllers/messageControllers';
import { verifyTokenMiddlewares } from '@Middlewares';

const messageRouter = express.Router();

messageRouter.get(
  '/list-message',
  verifyTokenMiddlewares,
  getMessagesController,
);

export { messageRouter };
