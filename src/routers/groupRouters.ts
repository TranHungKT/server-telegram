import express from 'express';

import {
  createNewGroupController,
  getFilesOfGroupController,
  getListGroupsController,
} from '@Controllers/groupControllers/';
import { verifyTokenMiddlewares } from '@Middlewares';

const groupRouters = express.Router();

groupRouters.post(
  '/create-new-group',
  verifyTokenMiddlewares,
  createNewGroupController,
);

groupRouters.get(
  '/get-list-groups',
  verifyTokenMiddlewares,
  getListGroupsController,
);

groupRouters.get(
  '/get-list-images',
  verifyTokenMiddlewares,
  getFilesOfGroupController,
);

export { groupRouters };
