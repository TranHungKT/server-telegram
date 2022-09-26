import { HydratedDocument } from 'mongoose';

import { IMessageAfterPopulateUserAndMapForFronEnd, IUser } from '@Models';
import { messageService } from '@Services';
import { normalizedUser } from '@Utils';

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
    await yupSendNewMessage.validate(message);

    const newMessage = await messageService.createNewMessage({
      newMessageData: message,
    });
    await messageService.addMessageToGroupItBelongTo({
      messageId: newMessage._id.toString(),
      groupMessageBelongTo,
    });

    const newMessageAfterPopulatedUser = await newMessage.populate<{
      user: HydratedDocument<IUser>;
    }>({
      path: 'user',
      select: '_id avatarUrl firstName lastName',
    });

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
    throw new Error('');
  }
};
