import { GetListMessagesResponse } from '@Services';

export const normalizedResponseMessageImage = (
  messages: GetListMessagesResponse,
) => {
  return messages.messages
    .map((message) => {
      if (message._id.image) {
        return message._id.image;
      }
      return undefined;
    })
    .filter((message) => !!message);
};
