import { SendNewMessagePayload } from '@Controllers/socketControllers/helpers/schemas'

export interface CreateNewMessagePayload {
  newMessageData: SendNewMessagePayload
  groupMessageBelongTo: string
}

export interface IMessageService {
  createNewMessage({
    newMessageData,
    groupMessageBelongTo,
  }: CreateNewMessagePayload): Promise<void>
}
