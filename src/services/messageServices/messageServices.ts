import { GroupModel, MessageModel } from '@Models'
import {
  IMessageService,
  CreateNewMessagePayload,
} from './messageServiceModels'

import { DatabaseError } from '@Utils'

export class DefaultMessageService implements IMessageService {
  constructor() {}

  async createNewMessage({
    newMessageData,
    groupMessageBelongTo,
  }: CreateNewMessagePayload): Promise<void> {
    try {
      const newMessage = new MessageModel(newMessageData)
      await newMessage.save()
      const group = await GroupModel.findById(groupMessageBelongTo)
      if (group) {
        group.messages = [...group.messages, newMessage._id.toString()]
        group.save()
      }
    } catch (error) {
      throw new DatabaseError()
    }
  }
}

export const messageService = new DefaultMessageService()
