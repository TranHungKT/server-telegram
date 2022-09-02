import express from 'express'

import {
  createNewGroupController,
  getListGroupsController,
} from '@Controllers/groupControllers/'

import { verifyTokenMiddlewares } from '@Middlewares'

const groupRouter = express.Router()

groupRouter.post(
  '/create-new-group',
  verifyTokenMiddlewares,
  createNewGroupController,
)

groupRouter.get(
  '/get-list-groups',
  verifyTokenMiddlewares,
  getListGroupsController,
)

export { groupRouter }
