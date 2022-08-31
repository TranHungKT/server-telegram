import { IUser, UserModel } from '@Models'
import { ConflictDatabaseError } from '@Utils'
import { AddGroupIdToListUserPayload, IUserService } from './useServiceModels'

class DefaultUserService implements IUserService {
  constructor() {}

  async findUsersByIds(ids: string[]): Promise<IUser[]> {
    const groupOfUser = Promise.all(
      ids.map(async (id) => {
        const user = await UserModel.findById(id)

        if (!user) {
          throw new ConflictDatabaseError('User does not exist')
        }
        return user
      }),
    )
    return groupOfUser
  }

  async addGroupIdToListUser(
    payload: AddGroupIdToListUserPayload,
  ): Promise<void> {
    const { memberIds, groupId } = payload
    Promise.all(
      memberIds.map(async (memberId) => {
        const user = await UserModel.findById(memberId)

        if (!user) {
          throw new ConflictDatabaseError('User does not exist')
        }
        user.groupUserBelongTo = [...user.groupUserBelongTo, groupId]

        user.save()
      }),
    )
  }
}

export const userService = new DefaultUserService()
