import { HydratedDocument } from 'mongoose';

import { CAN_NOT_FIND_MESSAGE } from '@Constants';
import { GroupModel, IMessage, MessageModel, MessageStatus } from '@Models';
import { ConflictDatabaseError, DatabaseError } from '@Utils';

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
      const newMessage = new MessageModel({
        ...newMessageData,
        createdAt: new Date(),
        seen: false,
        sent: true,
        received: false,
      });

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

  async updateMessageStatus({
    messageId,
    status,
  }: {
    messageId: string;
    status: MessageStatus;
  }) {
    try {
      const message = await MessageModel.findById(messageId);
      if (message) {
        message[status] = true;
        message.save();

        return message;
      }
      throw new Error(CAN_NOT_FIND_MESSAGE);
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async deleteMessagesByIds({
    messageIds,
  }: {
    messageIds: string[];
  }): Promise<void> {
    try {
      await MessageModel.deleteMany({
        $in: {
          messageIds,
        },
      });
    } catch (error) {
      throw new ConflictDatabaseError('Can not delete messages');
    }
  }
}

export const messageService = new DefaultMessageService();
