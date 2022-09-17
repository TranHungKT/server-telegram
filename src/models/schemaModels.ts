import { model, Schema } from 'mongoose'
import { UserSchema, GroupSchema, MessageSchema } from '@Schemas'
import { SCHEMA_NAME } from '@Constants'
import { UserStatus } from './userModels'
import { TypeOfGroup } from './groupModels'

export interface IUser {
  oAuthId: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string
  groupUserBelongTo: string[]
  status: UserStatus
}

export const UserModel = model<IUser>(SCHEMA_NAME.USER, UserSchema)

export interface IGroup {
  members: string[]
  messages: string[]
  typeOfGroup: TypeOfGroup
  lastUpdatedAt?: Date
}

export const GroupModel = model<IGroup>(SCHEMA_NAME.GROUP, GroupSchema)

export interface IMessage {
  text: string
  createdAt: Date
  user: Schema.Types.ObjectId
  sent: boolean
  received: boolean
  pending: boolean
}

export const MessageModel = model<IMessage>(SCHEMA_NAME.MESSAGE, MessageSchema)
