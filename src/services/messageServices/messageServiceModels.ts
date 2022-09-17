import { SendNewMessagePayload } from '@Controllers/socketControllers/helpers/schemas'
import { IMessage } from '@Models'
import { HydratedDocument } from 'mongoose'

export interface CreateNewMessagePayload {
  newMessageData: SendNewMessagePayload
}

export interface AddMessageToGroupItBelongToPayload {
  messageId: string
  groupMessageBelongTo: string
}

export interface IMessageService {
  createNewMessage({
    newMessageData,
  }: CreateNewMessagePayload): Promise<HydratedDocument<IMessage>>

  addMessageToGroupItBelongTo({
    messageId,
    groupMessageBelongTo,
  }: AddMessageToGroupItBelongToPayload): Promise<void>
}
