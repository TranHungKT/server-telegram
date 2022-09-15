import express from 'express'
import passport from 'passport'
import '../controllers/userControllers/userController'
import { getBaseUserController } from '../controllers/userControllers/getBaseUserController'
const userRouter = express.Router()
import { RequestUserAfterAuthenticate } from '@Models'
import { verifyTokenMiddlewares } from '@Middlewares'
userRouter.get('/auth/facebook', passport.authenticate('facebook'))

userRouter.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
  (req: RequestUserAfterAuthenticate, res) => {
    res.redirect(
      `telegram://app/login?firstName=${req.user.firstName}&lastName=${req.user.lastName}&email=${req.user.email}&accessToken=${req.user.accessToken}&id=${req.user.id}&avatarUrl=${req.user.avatarUrl}`,
    )
  },
)

userRouter.get('/fail', (req, res) => {
  res.send('Failed attempt')
})

userRouter.get('/user-data', verifyTokenMiddlewares, getBaseUserController)

export { userRouter }
