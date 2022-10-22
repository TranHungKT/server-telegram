import express from 'express';

import {
  createNewGroupController,
  getListGroupsController,
  getUnreadMessageController,
} from '@Controllers/groupControllers/';
import { verifyTokenMiddlewares } from '@Middlewares';

const groupRouter = express.Router();

groupRouter.post(
  '/create-new-group',
  verifyTokenMiddlewares,
  createNewGroupController,
);

groupRouter.get(
  '/get-list-groups',
  verifyTokenMiddlewares,
  getListGroupsController,
);

groupRouter.get(
  '/get-unread-messages',
  verifyTokenMiddlewares,
  getUnreadMessageController,
);

export { groupRouter };
