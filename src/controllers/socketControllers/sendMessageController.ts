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

    const newMessage = await messageService.createNewMessage({
      newMessageData: message,
    })
    await messageService.addMessageToGroupItBelongTo({
      messageId: newMessage._id.toString(),
      groupMessageBelongTo,
    })
  } catch (error) {
    // TODO: ADD PATTERN OF THROW ERROR BY SOCKET
    throw new Error('')
  }
}
