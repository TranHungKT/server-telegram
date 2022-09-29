// HOW TO SEND MESSAGE
// STEP 1: Validate message
// STEP 2: Create new message and save to message db
// STEP 3: Update last message to group
// STEP 4: Add message to group
// STEP 5: Populate user data and response
import { HydratedDocument } from 'mongoose';

import { SOCKET_ERROR_TYPE } from '@Constants';
import { IMessageAfterPopulateUserAndMapForFronEnd, IUser } from '@Models';
import { groupServices, messageService } from '@Services';
import { APIError, normalizedUser } from '@Utils';

import { SendNewMessagePayload, yupSendNewMessage } from './helpers';

interface SendMessageControllerProps {
  groupMessageBelongTo: string;
  message: SendNewMessagePayload;
}

export const sendMessageController = async ({
  groupMessageBelongTo,
  message,
}: SendMessageControllerProps): Promise<IMessageAfterPopulateUserAndMapForFronEnd> => {
  try {
    // Step 1
    await yupSendNewMessage.validate(message);

    // Step 2
    const newMessage = await messageService.createNewMessage({
      newMessageData: message,
    });

    // Step 3
    await groupServices.updateLastMessage({
      messageId: newMessage._id.toString(),
      groupMessageBelongTo,
    });

    // Step 4
    await messageService.addMessageToGroupItBelongTo({
      messageId: newMessage._id.toString(),
      groupMessageBelongTo,
    });

    // Step 5
    const newMessageAfterPopulatedUser = await newMessage.populate<{
      user: HydratedDocument<IUser>;
    }>({
      path: 'user',
    });

    // Step 6
    const { _id, text, createdAt, user, sent, received, pending } =
      newMessageAfterPopulatedUser;

    return {
      _id: _id,
      text: text,
      createdAt: createdAt,
      user: normalizedUser(user),
      sent: sent,
      received: received,
      pending: pending,
    };
  } catch (error) {
    // TODO: ADD PATTERN OF THROW ERROR BY SOCKET
    throw new APIError(SOCKET_ERROR_TYPE.SAVE_MESSAGE_ERROR);
  }
};
