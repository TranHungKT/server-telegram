import { messageService } from '@Services'

import { yupSendNewMessage, SendNewMessagePayload } from './helpers/schemas'

interface SendMessageControllerProps {
  groupMessageBelongTo: string
  message: SendNewMessagePayload
}

export const sendMessageController = async ({
  groupMessageBelongTo,
  message,
}: SendMessageControllerProps) => {
  try {
    await yupSendNewMessage.validate(message)

    await messageService.createNewMessage({
      newMessageData: message,
      groupMessageBelongTo,
    })
  } catch (error) {
    throw new Error('')
  }
}
