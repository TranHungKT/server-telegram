import { Router } from 'express'
import { userRouter } from './userRouters'
import { groupRouter } from './groupRouters'

const router = Router()

router.use(userRouter)
router.use(groupRouter)

export { router }
