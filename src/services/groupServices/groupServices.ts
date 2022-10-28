import mongoose, { HydratedDocument } from 'mongoose';

import { GROUP_ALREADY_EXIST, GROUP_NOT_EXIST } from '@Constants';
import { GetListMessagePayload } from '@Controllers/messageControllers/helpers/schema';
import { GroupModel, IGroup, UserModel } from '@Models';
import {
  ConflictDatabaseError,
  DatabaseError,
  RequestValidationPayloadError,
} from '@Utils';
import { generateSkip } from '@Utils';

import {
  AddMessageToGroupItBelongToPayload,
  UpdateUnReadMessagePayload,
} from '../messageServices/messageServiceModels';
import {
  GetListMessagesResponse,
  GetListOfGroupsByIdsAndGetMemberInfo,
  GetNumberOfUnReadMessageResponse,
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

  async updateUnReadMessage({
    groupMessageBelongTo,
    sender,
  }: UpdateUnReadMessagePayload): Promise<void> {
    try {
      const response = await this.findGroupById(groupMessageBelongTo);

      if (response.unReadMessages.length) {
        response.unReadMessages.forEach((unReadMessage) => {
          if (unReadMessage.userId.toString() !== sender) {
            unReadMessage.numberOfUnReadMessages += 1;
          }
        });
      }

      response.save();
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async getNumberOfUnReadMessage({
    groupIds,
    userId,
  }: {
    groupIds: string[];
    userId: string;
  }): Promise<GetNumberOfUnReadMessageResponse> {
    const response = Promise.all(
      groupIds.map(async (groupId) => {
        try {
          const group = await this.findGroupById(groupId);

          const unReadMessageForUser = group.unReadMessages.find(
            (unReadMessage) => unReadMessage.userId.toString() === userId,
          );

          if (!unReadMessageForUser) {
            throw new RequestValidationPayloadError(
              `User ${userId} does not exist in ${groupId}`,
            );
          }

          return {
            groupId,
            numberOfUnReadMessage: unReadMessageForUser.numberOfUnReadMessages,
          };
        } catch (error) {
          throw new DatabaseError();
        }
      }),
    );
    return response;
  }
  async seenAllMessage({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }): Promise<void> {
    try {
      const group = await this.findGroupById(groupId);

      const indexOfUnReadMessageForUser = group.unReadMessages.findIndex(
        (unReadMessage) => unReadMessage.userId.toString() === userId,
      );

      if (indexOfUnReadMessageForUser === -1) {
        throw new RequestValidationPayloadError(
          `User ${userId} does not exist in ${groupId}`,
        );
      }

      group.unReadMessages[
        indexOfUnReadMessageForUser
      ].numberOfUnReadMessages = 0;
      group.save();
    } catch (error) {
      throw new DatabaseError();
    }
  }
}

export const groupServices = new DefaultGroupService();
