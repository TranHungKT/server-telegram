import { HydratedDocument } from 'mongoose';

import { CAN_NOT_FIND_MESSAGE } from '@Constants';
import { GroupModel, IMessage, MessageModel } from '@Models';
import { DatabaseError } from '@Utils';

import {
  AddMessageToGroupItBelongToPayload,
  CreateNewMessagePayload,
  IMessageService,
} from './messageServiceModels';

export class DefaultMessageService implements IMessageService {
  constructor() {}

  async createNewMessage({
    newMessageData,
  }: CreateNewMessagePayload): Promise<HydratedDocument<IMessage>> {
    try {
      const newMessage = new MessageModel(newMessageData);
      newMessage.sent = true;
      await newMessage.save();
      return newMessage;
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async addMessageToGroupItBelongTo({
    messageId,
    groupMessageBelongTo,
  }: AddMessageToGroupItBelongToPayload): Promise<void> {
    const group = await GroupModel.findById(groupMessageBelongTo);
    if (group) {
      group.messages = [
        ...group.messages,
        { _id: messageId, lastUpdatedAt: new Date() },
      ];
      group.save();
    }
  }

  async updateMessageToReceivedStatus(messageId: string) {
    try {
      const message = await MessageModel.findById(messageId);
      if (message) {
        message.received = true;
        message.save();

        return message;
      }
      throw new Error(CAN_NOT_FIND_MESSAGE);
    } catch (error) {
      throw new DatabaseError();
    }
  }
}

export const messageService = new DefaultMessageService();
