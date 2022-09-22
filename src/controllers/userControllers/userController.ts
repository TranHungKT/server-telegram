import dotenv from 'dotenv';
import { HydratedDocument } from 'mongoose';
import passport from 'passport';
import strategy from 'passport-facebook';

import { IUser, UserModel, UserStatus } from '@Models';
import { userService } from '@Services';

const FacebookStrategy = strategy.Strategy;

dotenv.config();
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj as any);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || '',
      profileFields: ['email', 'displayName', 'id', 'name', 'photos'],
    },
    async function (accessToken, _, profile, done) {
      const { email, first_name, last_name, picture, id } = profile._json;

      const userData: IUser = {
        email,
        firstName: first_name,
        lastName: last_name,
        status: UserStatus.ONLINE,
        avatarUrl: picture.data.url,
        groupUserBelongTo: [],
        oAuthId: id,
      };

      let user: HydratedDocument<IUser> | null;

      user = await UserModel.findOne({ email });
      if (!user) {
        user = await userService.createNewUser(userData);
      }

      done(null, { accessToken });
    },
  ),
);
