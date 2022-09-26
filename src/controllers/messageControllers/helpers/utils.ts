import { GetListMessagesResponse } from '@Services';
import { normalizedUser } from '@Utils';

export const normalizedResponseMessage = (
  messages: GetListMessagesResponse,
) => {
  return messages.messages.map((message) => {
    const { _id, text, createdAt, user, sent, received, pending } = message._id;

    return {
      _id: _id,
      text: text,
      createdAt: createdAt,
      user: normalizedUser(user),
      sent: sent,
      received: received,
      pending: pending,
    };
  });
};
