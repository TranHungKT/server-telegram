import express from 'express';
import passport from 'passport';

import { verifyTokenMiddlewares } from '@Middlewares';
import { RequestUserAfterAuthenticate } from '@Models';

import { getBaseUserController } from '../controllers/userControllers';
import '../controllers/userControllers/userController';

const userRouter = express.Router();

userRouter.get('/auth/facebook', passport.authenticate('facebook'));

userRouter.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
  (req: RequestUserAfterAuthenticate, res) => {
    res.redirect(`telegram://app/login?&accessToken=${req.user.accessToken}`);
  },
);

userRouter.get('/fail', (req, res) => {
  res.send('Failed attempt');
});

userRouter.get('/user-data', verifyTokenMiddlewares, getBaseUserController);

export { userRouter };
