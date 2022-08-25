import { model } from 'mongoose'
import { UserSchema } from '@Schemas'
import { SCHEMA_NAME } from '@Constants'

export interface IUser {
  email: string
  firstName: string
  lastName: string
}

export const UserModel = model<IUser>(SCHEMA_NAME.USER, UserSchema)
