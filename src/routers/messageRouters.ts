import express from 'express'

import { getMessagesController } from '@Controllers/messageControllers/getMessagesController'
import { verifyTokenMiddlewares } from '@Middlewares'

const messageRouter = express.Router()

messageRouter.get(
  '/list-message',
  verifyTokenMiddlewares,
  getMessagesController,
)

export { messageRouter }
