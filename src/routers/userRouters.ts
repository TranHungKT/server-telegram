import express from 'express';
import passport from 'passport';

import { verifyTokenMiddlewares } from '@Middlewares';
import { RequestUserAfterAuthenticate } from '@Models';

import {
  getBaseUserController,
  getConnectionStatusController,
  getUserDataController,
} from '../controllers/userControllers';
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

userRouters.get('/current-user', verifyTokenMiddlewares, getBaseUserController);

userRouters.post(
  '/connect-status',
  verifyTokenMiddlewares,
  getConnectionStatusController,
);

userRouters.get(
  '/user-data/:id',
  verifyTokenMiddlewares,
  getUserDataController,
);

export { userRouters };
