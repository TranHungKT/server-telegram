import { IUser } from '@Models'

export interface AddGroupIdToListUserPayload {
  memberIds: string[]
  groupId: string
}

export interface IUserService {
  findUsersByIds(ids: string[]): Promise<IUser[]>
  addGroupIdToListUser(payload: AddGroupIdToListUserPayload): Promise<void>
}
