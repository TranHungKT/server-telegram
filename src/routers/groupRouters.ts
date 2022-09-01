import express from 'express'

import { createNewGroupController } from '@Controllers/groupControllers/groupController'

import { verifyTokenMiddlewares } from '@Middlewares'

const groupRouter = express.Router()

groupRouter.post(
  '/create-new-group',
  verifyTokenMiddlewares,
  createNewGroupController,
)

export { groupRouter }
