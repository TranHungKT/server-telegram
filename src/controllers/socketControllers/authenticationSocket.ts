import http from 'http';
import { HydratedDocument } from 'mongoose';
import socket from 'socket.io';

import {
  SOCKET_CONNECT_USERS,
  SOCKET_ERROR_TYPE,
  SOCKET_EVENTS,
  UNAUTHORIZED_MESSAGE,
} from '@Constants';
import { IUser } from '@Models';
import { userService } from '@Services';
import { SocketError, getRedisValue, setRedisValue } from '@Utils';

import IntializeSocket from './initializeSocket';

export default class AuthenticationSocket extends IntializeSocket {
  constructor(expressServer: http.Server) {
    super(expressServer);
  }

  authenticationSocket() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;

        const user = await this.verifySocketConnect(token);

        this.setSocketAuth({ user, socket });

        await this.handleSocketConnect(user._id.toString());
        next();
      } catch (error) {
        this.handleSocketError(error as SocketError, socket.id);
      }
    });
  }

  async verifySocketConnect(token: string) {
    try {
      if (!token) {
        throw new SocketError(UNAUTHORIZED_MESSAGE);
      }

      return await userService.findUserByToken(token);
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.USER_NOT_EXIST);
    }
  }

  setSocketAuth({
    user,
    socket,
  }: {
    user: HydratedDocument<IUser>;
    socket: socket.Socket;
  }) {
    socket.data.userId = user._id.toString();
  }
  async handleSocketConnect(userId: string) {
    try {
      console.log('connected user', userId);

      let connectedSocket: string[] | null = await getRedisValue(
        SOCKET_CONNECT_USERS,
      );

      if (!connectedSocket) {
        setRedisValue(SOCKET_CONNECT_USERS, JSON.stringify([]));
        connectedSocket = [];
      }

      if (!connectedSocket.includes(userId)) {
        connectedSocket.push(userId);
        setRedisValue(SOCKET_CONNECT_USERS, JSON.stringify(connectedSocket));
      }
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.USER_NOT_EXIST);
    }
  }

  async handleSocketError(error: SocketError, socketId: string) {
    this.io
      .to(socketId)
      .emit(SOCKET_EVENTS.SOCKET_ERROR, error.normarlizeError());
  }
}
