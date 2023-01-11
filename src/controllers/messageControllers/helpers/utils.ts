import { GetListMessagesResponse } from '@Services';
import { normalizedUser } from '@Utils';

export const normalizedResponseMessage = (
  messages: GetListMessagesResponse,
) => {
  if (messages && messages.messages.length) {
    return messages.messages.map((message) => {
      const {
        _id,
        text,
        createdAt,
        user,
        sent,
        received,
        pending,
        seen,
        image,
      } = message._id;

      return {
        _id,
        text,
        createdAt,
        user: normalizedUser(user),
        sent,
        received,
        pending,
        seen,
        image,
      };
    });
  }
  return [];
};
