import express from 'express'

import { createNewGroupController } from '@Controllers/groupControllers/groupController'
const groupRouter = express.Router()

groupRouter.post('/create-new-group', createNewGroupController)

export { groupRouter }
