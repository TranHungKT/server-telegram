import { HydratedDocument } from 'mongoose';

import { IUser } from '@Models';

export interface AddGroupIdToListUserPayload {
  memberIds: string[];
  groupId: string;
}

export interface IUserService {
  createNewUser(newUserData: IUser): Promise<HydratedDocument<IUser>>;
  findUsersByIds(ids: string[]): Promise<IUser[]>;
  addGroupIdToListUser(payload: AddGroupIdToListUserPayload): Promise<void>;
  findUserByOAuthId(id: string): Promise<IUser>;
  findUserById(id: string): Promise<HydratedDocument<IUser>>;
  deleteGroupUserBelongTo({
    userIds,
    groupId,
  }: {
    userIds: string[];
    groupId: string;
  }): Promise<void>;
}
