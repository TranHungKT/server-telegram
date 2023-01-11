import { HydratedDocument } from 'mongoose';

import { USER_NOT_EXIST } from '@Constants';
import { IUser, UserModel } from '@Models';
import { ConflictDatabaseError, DatabaseError } from '@Utils';

import { facebookServices } from '../facebookServices/facebookServices';
import { AddGroupIdToListUserPayload, IUserService } from './useServiceModels';

class DefaultUserService implements IUserService {
  constructor() {}

  async findUsersByIds(ids: string[]): Promise<IUser[]> {
    const groupOfUser = Promise.all(
      ids.map(async (id) => {
        const user = await UserModel.findById(id);

        if (!user) {
          throw new ConflictDatabaseError(USER_NOT_EXIST);
        }
        return user;
      }),
    );
    return groupOfUser;
  }

  async addGroupIdToListUser(
    payload: AddGroupIdToListUserPayload,
  ): Promise<void> {
    const { memberIds, groupId } = payload;
    Promise.all(
      memberIds.map(async (memberId) => {
        const user = await UserModel.findById(memberId);

        if (!user) {
          throw new ConflictDatabaseError(USER_NOT_EXIST);
        }
        user.groupUserBelongTo = [...user.groupUserBelongTo, groupId];

        user.save();
      }),
    );
  }

  async createNewUser(newUserData: IUser): Promise<HydratedDocument<IUser>> {
    try {
      return await new UserModel(newUserData).save();
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async findUserByOAuthId(id: string): Promise<HydratedDocument<IUser>> {
    const user = await UserModel.findOne({ oAuthId: id });

    if (!user) {
      throw new ConflictDatabaseError(USER_NOT_EXIST);
    }
    return user;
  }

  async findUserById(id: string): Promise<HydratedDocument<IUser>> {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new ConflictDatabaseError(USER_NOT_EXIST);
    }
    return user;
  }

  async findUserByToken(token: string): Promise<HydratedDocument<IUser>> {
    const { id } = await facebookServices.getUserData(token);

    const user = await userService.findUserByOAuthId(id);

    if (!user) {
      throw new ConflictDatabaseError(USER_NOT_EXIST);
    }

    return user;
  }

  async deleteGroupUserBelongTo({
    userIds,
    groupId,
  }: {
    userIds: string[];
    groupId: string;
  }): Promise<void> {
    try {
      userIds.forEach(async (userId) => {
        const user = await UserModel.findById(userId);

        user?.groupUserBelongTo.filter(
          (currentGroupId) => currentGroupId !== groupId,
        );
        user?.save();
      });
    } catch (error) {
      throw new DatabaseError();
    }
  }
}

export const userService = new DefaultUserService();
