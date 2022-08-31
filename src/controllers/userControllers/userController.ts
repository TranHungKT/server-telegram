import passport from 'passport'
import dotenv from 'dotenv'
import strategy from 'passport-facebook'
import { IUser, SchemaWithId, UserModel, UserStatus } from '@Models'
import { generateAndSaveTokenToRedis } from '../../utils/generateToken'

const FacebookStrategy = strategy.Strategy

dotenv.config()
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj as any)
})

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || '',
      profileFields: ['email', 'displayName', 'id', 'name', 'photos'],
    },
    async function (accessToken, refreshToken, profile, done) {
      const { email, first_name, last_name, picture } = profile._json

      const userData: IUser = {
        email,
        firstName: first_name,
        lastName: last_name,
        status: UserStatus.ONLINE,
        avatarUrl: picture.data.url,
        groupUserBelongTo: [],
      }

      generateAndSaveTokenToRedis({
        email,
        type: 'OAUTH',
        accessToken,
        refreshToken,
      })
      let user: SchemaWithId<IUser> | null

      user = await UserModel.findOne({ email })
      if (!user) {
        user = await new UserModel(userData).save()
      }

      done(null, { ...userData, id: user._id })
    },
  ),
)
