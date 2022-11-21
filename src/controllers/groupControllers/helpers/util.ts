import { GetListMessagesResponse } from '@Services';

export const normalizedResponseMessageImage = (
  messages: GetListMessagesResponse,
) => {
  return messages.messages
    .filter((message) => message._id.image)
    .map((message) => {
      return {
        id: message._id._id,
        image: message._id.image,
      };
    });
};
