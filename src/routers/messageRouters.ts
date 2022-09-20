import express from 'express'

import { messageController } from '@Controllers/messageControllers/messageController'
import { verifyTokenMiddlewares } from '@Middlewares'
const messageRouter = express.Router()

messageRouter.get('/list-message', verifyTokenMiddlewares, messageController)

export { messageRouter }
