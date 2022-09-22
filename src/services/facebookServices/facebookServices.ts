import axios from 'axios';

import { UNAUTHORIZED_MESSAGE } from '@Constants';
import { APIError } from '@Utils';

import {
  BaseUserReturnFromFacebook,
  IFacebookService,
} from './facebookServiceModels';

class DefaultFacebookService implements IFacebookService {
  constructor() {}

  async getUserData(accessToken: string): Promise<BaseUserReturnFromFacebook> {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me?access_token=${accessToken}`,
      );
      return response.data;
    } catch (error) {
      throw new APIError(UNAUTHORIZED_MESSAGE);
    }
  }
}

export const facebookServices = new DefaultFacebookService();
