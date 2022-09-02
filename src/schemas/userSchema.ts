import { Schema } from 'mongoose'
import { UserStatus, IUser } from '@Models'

export const UserSchema = new Schema<IUser>({
  email: String,
  oAuthId: String, // NOTE: This oAuthId only use for valdiate token
  firstName: String,
  lastName: String,
  avatarUrl: String,
  groupUserBelongTo: [String],
  status: {
    type: String,
    enum: UserStatus,
    required: true,
  },
})
