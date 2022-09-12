import { GroupModel, IGroup } from '@Models'
import { ConflictDatabaseError, DatabaseError } from '@Utils'
import {
  IGroupService,
  ValidateGroupExistPayload,
  GetListOfGroupsByIdsAndGetMemberInfo,
} from './groupServiceModels'
import { HydratedDocument } from 'mongoose'
import { generateSkip } from '@Utils'

class DefaultGroupService implements IGroupService {
  constructor() {}

  async validateGroupExist({
    ids,
    shouldThrowErrorWhenExist,
    message = 'This Group Already Exist',
  }: ValidateGroupExistPayload): Promise<void> {
    const response = await GroupModel.find({
      members: ids,
    })

    if (!!response.length === shouldThrowErrorWhenExist) {
      throw new ConflictDatabaseError(message)
    }
  }

  async createNewGroup(
    newGroupData: IGroup,
  ): Promise<HydratedDocument<IGroup>> {
    try {
      return await new GroupModel(newGroupData).save()
    } catch (error) {
      throw new DatabaseError()
    }
  }

  async findListOfGroupsByIdsAndGetMemberInfo(
    payload: GetListOfGroupsByIdsAndGetMemberInfo,
  ): Promise<HydratedDocument<IGroup>[]> {
    const { ids, pageNumber, pageSize } = payload

    const listOfGroups = await GroupModel.find({
      _id: { $in: ids },
    })
      .sort({ lastUpdatedAt: -1 })
      .skip(generateSkip({ pageNumber, pageSize }))
      .limit(pageSize)
      .select('-__v')
      .populate({
        path: 'members',
        select: '-groupUserBelongTo -oAuthId -__v',
      })

    return listOfGroups
  }
}

export const groupServices = new DefaultGroupService()
