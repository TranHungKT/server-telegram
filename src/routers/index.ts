import { Router } from 'express'
import { userRouter } from './userRouters'
import { groupRouter } from './groupRouters'
import { messageRouter } from './messageRouters'

const router = Router()

router.use(userRouter)
router.use(groupRouter)
router.use(messageRouter)

export { router }
