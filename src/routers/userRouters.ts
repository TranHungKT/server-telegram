import express from 'express';
import passport from 'passport';

import { getConnectionStatusController } from '@Controllers/userControllers/getConnectionStatusController';
import { verifyTokenMiddlewares } from '@Middlewares';
import { RequestUserAfterAuthenticate } from '@Models';

import { getBaseUserController } from '../controllers/userControllers';
import '../controllers/userControllers/userController';

const userRouters = express.Router();

userRouters.get('/auth/facebook', passport.authenticate('facebook'));

userRouters.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
  (req: RequestUserAfterAuthenticate, res) => {
    res.redirect(`telegram://app/login?&accessToken=${req.user.accessToken}`);
  },
);

userRouters.get('/fail', (req, res) => {
  res.send('Failed attempt');
});

userRouters.get('/user-data', verifyTokenMiddlewares, getBaseUserController);

userRouters.get(
  '/connect-status',
  verifyTokenMiddlewares,
  getConnectionStatusController,
);

export { userRouters };
