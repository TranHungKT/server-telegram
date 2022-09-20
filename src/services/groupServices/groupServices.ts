import { GroupModel, IGroup } from '@Models'
import { ConflictDatabaseError, DatabaseError } from '@Utils'
import {
  IGroupService,
  ValidateGroupExistPayload,
  GetListOfGroupsByIdsAndGetMemberInfo,
  GetListMessagesResponse,
} from './groupServiceModels'
import mongoose, { HydratedDocument } from 'mongoose'
import { generateSkip } from '@Utils'

import { GetListMessagePayload } from '@Controllers/messageControllers/helpers/schema'

class DefaultGroupService implements IGroupService {
  constructor() {}

  async findGroupById(groupId: string): Promise<HydratedDocument<IGroup>> {
    try {
      const response = await GroupModel.findById(groupId)

      if (!response) {
        throw new ConflictDatabaseError('This group does not exist')
      }

      return response
    } catch (error) {
      console.log(error)
      throw new ConflictDatabaseError('This group does not exist')
    }
  }

  async validateGroupExist({
    ids,
    shouldThrowErrorWhenExist,
    message = 'This Group Already Exist',
  }: ValidateGroupExistPayload): Promise<void> {
    try {
      const response = await GroupModel.find({
        members: ids,
      })

      if (!!response.length === shouldThrowErrorWhenExist) {
        throw new ConflictDatabaseError(message)
      }
    } catch (error) {
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

  async getListMessages(
    payload: GetListMessagePayload,
  ): Promise<GetListMessagesResponse[]> {
    const { groupId, pageNumber, pageSize } = payload

    const parsedPageNumber = parseInt(pageNumber)
    const parsedPageSize = parseInt(pageSize)

    const listOfMessages = await GroupModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(groupId) } },
      { $unwind: '$messages' },
      { $project: { messages: 1 } },
      { $sort: { 'messages.lastUpdatedAt': -1 } },
      {
        $skip: generateSkip({
          pageNumber: parsedPageNumber,
          pageSize: parsedPageSize,
        }),
      },
      { $limit: parsedPageSize },
      {
        $group: {
          _id: '$_id',
          messages: {
            $push: {
              _id: '$messages._id',
              lastUpdatedAt: '$messages.lastUpdatedAt',
            },
          },
        },
      },
    ])

    return (await GroupModel.populate(listOfMessages, {
      path: 'messages._id',
    })) as any
  }

  async getTotalChatCount(groupId: string): Promise<number> {
    const response = await GroupModel.findById(groupId)

    if (!response) {
      throw new ConflictDatabaseError('This group does not exist')
    }

    return response.members.length
  }
}

export const groupServices = new DefaultGroupService()
