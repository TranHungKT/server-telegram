import mongoose, { HydratedDocument } from 'mongoose';

import { GROUP_ALREADY_EXIST, GROUP_NOT_EXIST } from '@Constants';
import { GetFilesOfGroupPayload } from '@Controllers/groupControllers/helpers';
import { GetListMessagePayload } from '@Controllers/messageControllers/helpers/schema';
import { GroupModel, IGroup, UserModel } from '@Models';
import {
  ConflictDatabaseError,
  DatabaseError,
  RequestValidationPayloadError,
} from '@Utils';
import { generateSkip } from '@Utils';

import { AddMessageToGroupItBelongToPayload } from '../messageServices/messageServiceModels';
import {
  GetListMessagesResponse,
  GetListOfGroupsByIdsAndGetMemberInfo,
  IGroupService,
  ValidateGroupExistPayload,
} from './groupServiceModels';

class DefaultGroupService implements IGroupService {
  constructor() {}

  async findGroupById(groupId: string): Promise<HydratedDocument<IGroup>> {
    try {
      const response = await GroupModel.findById(groupId);

      if (!response) {
        throw new RequestValidationPayloadError(
          `GroupId: ${groupId}: ${GROUP_NOT_EXIST}`,
        );
      }

      return response;
    } catch (error) {
      throw new RequestValidationPayloadError(
        `GroupId: ${groupId}: ${GROUP_NOT_EXIST}`,
      );
    }
  }

  async validateGroupExist({
    ids,
    shouldThrowErrorWhenExist,
    message = GROUP_ALREADY_EXIST,
  }: ValidateGroupExistPayload): Promise<void> {
    try {
      const response = await GroupModel.find({
        members: ids,
      });

      if (!!response.length === shouldThrowErrorWhenExist) {
        throw new ConflictDatabaseError(message);
      }
    } catch (error) {
      throw new ConflictDatabaseError(message);
    }
  }

  async createNewGroup(
    newGroupData: IGroup,
  ): Promise<HydratedDocument<IGroup>> {
    try {
      return await new GroupModel(newGroupData).save();
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async findListOfGroupsByIdsAndGetMemberInfo(
    payload: GetListOfGroupsByIdsAndGetMemberInfo,
  ): Promise<HydratedDocument<IGroup>[]> {
    const { ids, pageNumber, pageSize } = payload;

    const listOfGroups = await GroupModel.find({
      _id: { $in: ids },
    })
      .sort({ lastUpdatedAt: -1 })
      .skip(generateSkip({ pageNumber, pageSize }))
      .limit(pageSize)
      .select('-__v -messages')
      .populate({
        path: 'members',
        select: '-groupUserBelongTo -oAuthId -__v',
      })
      .populate('lastMessage');

    return listOfGroups;
  }

  async getListMessages(
    payload: GetListMessagePayload,
  ): Promise<GetListMessagesResponse[]> {
    const { groupId, pageNumber, pageSize } = payload;

    const parsedPageNumber = parseInt(pageNumber);
    const parsedPageSize = parseInt(pageSize);

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
    ]);

    const listMessage = await GroupModel.populate(listOfMessages, {
      path: 'messages._id',
    });

    return (await GroupModel.populate(listMessage, {
      path: 'messages._id.user',
      model: UserModel,
      select: '_id firstName lastName avatarUrl',
    })) as any;
  }

  async getTotalChatCount(groupId: string): Promise<number> {
    const response = await this.findGroupById(groupId);

    return response.messages.length;
  }

  async updateLastMessage({
    groupMessageBelongTo,
    messageId,
  }: AddMessageToGroupItBelongToPayload): Promise<void> {
    try {
      const response = await this.findGroupById(groupMessageBelongTo);

      response.lastMessage = messageId;

      response.save();
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async getFilesOfGroup(payload: GetFilesOfGroupPayload): Promise<any> {
    const { groupId } = payload;

    const listOfMessages = await GroupModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(groupId) } },
      { $unwind: '$messages' },
      { $project: { messages: 1 } },
      { $sort: { 'messages.lastUpdatedAt': -1 } },
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
    ]);

    return await GroupModel.populate(listOfMessages, {
      path: 'messages._id',
    });
  }

  async deleteGroupById(groupId: string): Promise<void> {
    try {
      await GroupModel.deleteOne({ _id: groupId });
    } catch (error) {
      throw new ConflictDatabaseError('Can not delete group');
    }
  }
}

export const groupServices = new DefaultGroupService();
