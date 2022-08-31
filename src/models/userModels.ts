import { Request } from 'express'
import { ObjectId } from 'mongoose'

export interface LoginUserData {
  email: string
  firstName: string
  lastName: string
  accessToken: string
}

export interface LoginUserDataWithObjectId extends LoginUserData {
  id: ObjectId
}

export interface RequestUserAfterAuthenticate extends Request {
  user: LoginUserDataWithObjectId
}

export enum UserStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
}
