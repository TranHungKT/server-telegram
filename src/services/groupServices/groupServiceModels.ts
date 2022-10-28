import { HydratedDocument, ObjectId } from 'mongoose';

import { GetListMessagePayload } from '@Controllers/messageControllers/helpers/schema';
import { IGroup, IMessageAfterPopulateUser } from '@Models';

import {
  AddMessageToGroupItBelongToPayload,
  UpdateUnReadMessagePayload,
} from '../messageServices/messageServiceModels';

export interface ValidateGroupExistPayload {
  ids: string[];
  shouldThrowErrorWhenExist: boolean;
  message?: string;
}

export interface GetListOfGroupsByIdsAndGetMemberInfo {
  ids: string[];
  pageSize: number;
  pageNumber: number;
}

type IdForMessages = HydratedDocument<IMessageAfterPopulateUser>;

export interface GetListMessagesResponse {
  _id: ObjectId;
  messages: {
    _id: IdForMessages;
    lastUpdatedAt: Date;
  }[];
}

export type GetNumberOfUnReadMessageResponse = {
  groupId: string;
  numberOfUnReadMessage: number;
}[];

export interface IGroupService {
  findGroupById(groupId: string): Promise<HydratedDocument<IGroup>>;
  validateGroupExist(payload: ValidateGroupExistPayload): Promise<void>;
  createNewGroup(newGroupData: IGroup): Promise<HydratedDocument<IGroup>>;
  findListOfGroupsByIdsAndGetMemberInfo(
    payload: GetListOfGroupsByIdsAndGetMemberInfo,
  ): Promise<HydratedDocument<IGroup>[]>;
  getListMessages(
    payload: GetListMessagePayload,
  ): Promise<GetListMessagesResponse[]>;
  getTotalChatCount(groupId: string): Promise<number>;
  updateLastMessage({
    groupMessageBelongTo,
    messageId,
  }: AddMessageToGroupItBelongToPayload): Promise<void>;
  updateUnReadMessage({
    groupMessageBelongTo,
    sender,
  }: UpdateUnReadMessagePayload): Promise<void>;
  getNumberOfUnReadMessage({
    groupIds,
    userId,
  }: {
    groupIds: string[];
    userId: string;
  }): Promise<GetNumberOfUnReadMessageResponse>;
  seenAllMessage({
    groupId,
    userId,
  }: {
    groupId: string;
    userId: string;
  }): Promise<void>;
}
