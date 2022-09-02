import { model } from 'mongoose'
import { UserSchema, GroupSchema } from '@Schemas'
import { SCHEMA_NAME } from '@Constants'
import { UserStatus } from './userModels'
import { Chat, TypeOfGroup } from './groupModels'

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
  name: string
  memberIds: string[]
  chats: Chat[]
  typeOfGroup: TypeOfGroup
}

export const GroupModel = model<IGroup>(SCHEMA_NAME.GROUP, GroupSchema)
