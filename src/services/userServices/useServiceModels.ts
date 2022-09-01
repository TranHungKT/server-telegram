import { IUser, SchemaWithId } from '@Models'

export interface AddGroupIdToListUserPayload {
  memberIds: string[]
  groupId: string
}

export interface IUserService {
  createNewUser(newUserData: IUser): Promise<SchemaWithId<IUser>>
  findUsersByIds(ids: string[]): Promise<IUser[]>
  addGroupIdToListUser(payload: AddGroupIdToListUserPayload): Promise<void>
}
