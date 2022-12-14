import { HydratedDocument, ObjectId } from 'mongoose';

import { GetFilesOfGroupPayload } from '@Controllers/groupControllers/helpers';
import { GetListMessagePayload } from '@Controllers/messageControllers/helpers/schema';
import { IGroup, IMessageAfterPopulateUser } from '@Models';

import { AddMessageToGroupItBelongToPayload } from '../messageServices/messageServiceModels';

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
  getFilesOfGroup(payload: GetFilesOfGroupPayload): Promise<any>;
  deleteGroupById(groupId: string): Promise<void>;
}
