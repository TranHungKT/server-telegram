import { Schema } from 'mongoose'
import { UserStatus, IUser } from '@Models'

export const UserSchema = new Schema<IUser>({
  email: String,
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
