import { flatMapDeep, map } from 'lodash';

import { GetListMessagesResponse } from '@Services';

export const normalizedResponseMessageImage = (
  messages: GetListMessagesResponse,
) => {
  return flatMapDeep(map(messages.messages, '_id.listImages'));
};
