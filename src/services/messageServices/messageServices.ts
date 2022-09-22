import { GroupModel, IMessage, MessageModel } from '@Models'
import {
  IMessageService,
  CreateNewMessagePayload,
  AddMessageToGroupItBelongToPayload,
} from './messageServiceModels'

import { DatabaseError } from '@Utils'
import { HydratedDocument } from 'mongoose'

export class DefaultMessageService implements IMessageService {
  constructor() {}

  async createNewMessage({
    newMessageData,
  }: CreateNewMessagePayload): Promise<HydratedDocument<IMessage>> {
    try {
      const newMessage = new MessageModel(newMessageData)
      await newMessage.save()
      return newMessage
    } catch (error) {
      throw new DatabaseError()
    }
  }

  async addMessageToGroupItBelongTo({
    messageId,
    groupMessageBelongTo,
  }: AddMessageToGroupItBelongToPayload): Promise<void> {
    const group = await GroupModel.findById(groupMessageBelongTo)
    if (group) {
      group.messages = [
        ...group.messages,
        { _id: messageId, lastUpdatedAt: new Date() },
      ]
      group.save()
    }
  }
}

export const messageService = new DefaultMessageService()
