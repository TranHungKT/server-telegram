import { HydratedDocument } from 'mongoose';

import { SendNewMessagePayload } from '@Controllers/socketControllers/helpers';
import { IMessage } from '@Models';

export interface CreateNewMessagePayload {
  newMessageData: SendNewMessagePayload;
}

export interface AddMessageToGroupItBelongToPayload {
  messageId: string;
  groupMessageBelongTo: string;
}

export interface UpdateUnreadMessagePayload {
  groupMessageBelongTo: string;
  sender: string;
}

export interface IMessageService {
  createNewMessage({
    newMessageData,
  }: CreateNewMessagePayload): Promise<HydratedDocument<IMessage>>;

  addMessageToGroupItBelongTo({
    messageId,
    groupMessageBelongTo,
  }: AddMessageToGroupItBelongToPayload): Promise<void>;

  updateMessageToReceivedStatus(
    messageId: string,
  ): Promise<HydratedDocument<IMessage>>;
}
