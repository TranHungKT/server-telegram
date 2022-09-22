import { HydratedDocument } from 'mongoose';

import { IUser } from '@Models';
import { GetListMessagesResponse } from '@Services';

export const normalizedUser = (user: HydratedDocument<IUser>) => {
  const { _id, avatarUrl, firstName, lastName } = user;

  return {
    _id,
    name: `${firstName} ${lastName}`,
    avatar: avatarUrl,
  };
};

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
