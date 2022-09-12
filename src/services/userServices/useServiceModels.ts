import { IUser } from '@Models'
import { HydratedDocument } from 'mongoose'
export interface AddGroupIdToListUserPayload {
  memberIds: string[]
  groupId: string
}

export interface IUserService {
  createNewUser(newUserData: IUser): Promise<HydratedDocument<IUser>>
  findUsersByIds(ids: string[]): Promise<IUser[]>
  addGroupIdToListUser(payload: AddGroupIdToListUserPayload): Promise<void>
  findUserByOAuthId(id: string): Promise<IUser>
}
