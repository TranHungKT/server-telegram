import { IUser, SchemaWithId, UserModel } from '@Models'
import { ConflictDatabaseError, DatabaseError } from '@Utils'
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

  async createNewUser(newUserData: IUser): Promise<SchemaWithId<IUser>> {
    try {
      return await new UserModel(newUserData).save()
    } catch (error) {
      throw new DatabaseError()
    }
  }

  async findUserByOAuthId(id: string): Promise<SchemaWithId<IUser>> {
    const user = await UserModel.findOne({ oAuthId: id })

    if (!user) {
      throw new ConflictDatabaseError('User does not exist')
    }
    return user
  }
}

export const userService = new DefaultUserService()
