import { HydratedDocument, ObjectId } from 'mongoose';

import { GetListMessagePayload } from '@Controllers/messageControllers/helpers/schema';
import { IGroup, IMessage, IUser } from '@Models';

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

interface IMessageAfterPopulateUser extends Omit<IMessage, 'user'> {
  user: HydratedDocument<IUser>;
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
}
