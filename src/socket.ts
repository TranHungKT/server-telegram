import http from 'http';
import { HydratedDocument } from 'mongoose';
import socket from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import {
  SOCKET_CONNECT_USERS,
  SOCKET_ERROR_TYPE,
  SOCKET_EVENTS,
  UNAUTHORIZED_MESSAGE,
} from '@Constants';
import { SendNewMessagePayload } from '@Controllers/socketControllers/helpers/schemas';
import { sendMessageController } from '@Controllers/socketControllers/sendMessageController';
import { IUser } from '@Models';
import { messageService, userService } from '@Services';
import {
  SocketError,
  getRedisValue,
  normalizedUser,
  setRedisValue,
} from '@Utils';

import { MessageStatus } from './models/messageModels';

export default class SocketServer {
  private io: socket.Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >;

  constructor(expressServer: http.Server) {
    this.io = new socket.Server(expressServer, {
      path: '/socket',
      transports: ['websocket'],
    });
  }

  async connectSocket() {
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

    this.io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        this.handleSocketDisconnect(socket.data.userId);
      });
      socket.onAny(async (event, ...args) => {
        try {
          const payload = args[0];
          console.log('payload', event, payload);
          switch (event) {
            case SOCKET_EVENTS.JOIN_ROOM:
              console.log(socket.id);
              await this.joinRoom({ socket, roomId: payload });
              break;
            case SOCKET_EVENTS.SEND_MESSAGE:
              await this.sendMessage(payload);
              break;
            case SOCKET_EVENTS.TYPING:
              await this.sendTypingEvent({ ...payload, event }, socket);
              break;
            case SOCKET_EVENTS.UN_TYPING:
              await this.sendTypingEvent({ ...payload, event }, socket);
              break;
            case SOCKET_EVENTS.RECEIVED_MESSAGE:
              await this.receivedMessage({ ...payload, socket });
              break;
            case SOCKET_EVENTS.SEEN_MESSAGE:
              await this.seenMessage({ ...payload, socket });
              break;
            case SOCKET_EVENTS.OFFER_FOR_CALL_EVENT:
              await this.offerCall(payload, socket);
              break;
            case SOCKET_EVENTS.ANSWER_FOR_CALL_EVENT:
              await this.answerCall(payload, socket);
              break;
            case SOCKET_EVENTS.ICE_CANDIDATE_EVENT:
              await this.handleIceCandidate(payload, socket);
              break;
            case SOCKET_EVENTS.HANG_UP_EVENT:
              await this.hangUpCall(payload, socket);
              break;
          }
        } catch (error) {
          console.log(error);
          this.handleSocketError(error as SocketError, socket.id);
        }
      });
    });
  }

  async offerCall(
    payload: { groupId: string; offer: any; callerId: string },
    socket: socket.Socket,
  ) {
    try {
      socket.broadcast
        .to(payload.groupId)
        .emit(SOCKET_EVENTS.OFFER_FOR_CALL_EVENT, {
          offer: payload.offer,
          groupId: payload.groupId,
          callerId: payload.callerId,
        });
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.SOMETHING_WENT_WRONG);
    }
  }

  async hangUpCall(payload: { groupId: string }, socket: socket.Socket) {
    try {
      socket.broadcast.to(payload.groupId).emit(SOCKET_EVENTS.HANG_UP_EVENT);
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.SOMETHING_WENT_WRONG);
    }
  }

  async answerCall(
    payload: { groupId: string; answer: any },
    socket: socket.Socket,
  ) {
    try {
      socket.broadcast
        .to(payload.groupId)
        .emit(SOCKET_EVENTS.ANSWER_FOR_CALL_EVENT, {
          answer: payload.answer,
          groupId: payload.groupId,
        });
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.SOMETHING_WENT_WRONG);
    }
  }

  async handleIceCandidate(
    payload: { groupId: string; iceCandidate: any },
    socket: socket.Socket,
  ) {
    try {
      socket.broadcast
        .to(payload.groupId)
        .emit(SOCKET_EVENTS.ICE_CANDIDATE_EVENT, {
          iceCandidate: payload.iceCandidate,
        });
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.SOMETHING_WENT_WRONG);
    }
  }

  async handleSocketError(error: SocketError, socketId: string) {
    this.io
      .to(socketId)
      .emit(SOCKET_EVENTS.SOCKET_ERROR, error.normarlizeError());
  }

  async joinRoom({
    socket,
    roomId,
  }: {
    socket: socket.Socket;
    roomId: string;
  }) {
    try {
      await socket?.join(roomId);
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.JOIN_ROOM_FAIL);
    }
  }

  async sendMessage(payload: {
    message: SendNewMessagePayload;
    roomId: string;
  }) {
    try {
      const newMessage = await sendMessageController({
        message: payload.message,
        groupMessageBelongTo: payload.roomId,
      });

      this.io.to(payload.roomId).emit(SOCKET_EVENTS.GET_MESSAGE, {
        newMessage,
        groupId: payload.roomId,
      });
    } catch (error) {
      console.log(error);
      throw new SocketError(SOCKET_ERROR_TYPE.SEND_MESSAGE_ERROR);
    }
  }

  async sendTypingEvent(
    payload: {
      user: string;
      groupId: string;
      event: string;
    },
    socket: socket.Socket,
  ) {
    try {
      const user = await userService.findUserById(payload.user);
      socket.broadcast.to(payload.groupId).emit(payload.event, {
        groupId: payload.groupId,
        user: normalizedUser(user),
      });
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.SEND_TYPING_EVENT_ERROR);
    }
  }

  async receivedMessage({
    groupId,
    messageIds,
    socket,
  }: {
    groupId: string;
    messageIds: string[];
    socket: socket.Socket;
  }) {
    try {
      messageIds.forEach(async (messageId) => {
        await messageService.updateMessageStatus({
          messageId,
          status: MessageStatus.RECEIVED,
        });
      });

      return socket.broadcast.to(groupId).emit(SOCKET_EVENTS.RECEIVED_MESSAGE, {
        groupId,
        messageIds,
      });
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.SOMETHING_WENT_WRONG);
    }
  }

  async seenMessage({
    groupId,
    messageIds,
    socket,
  }: {
    groupId: string;
    messageIds: string[];
    socket: socket.Socket;
  }) {
    try {
      messageIds.forEach(async (messageId) => {
        await messageService.updateMessageStatus({
          messageId,
          status: MessageStatus.SEEN,
        });
      });
      return socket.broadcast.to(groupId).emit(SOCKET_EVENTS.SEEN_MESSAGE, {
        groupId,
        messageIds,
      });
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.SOMETHING_WENT_WRONG);
    }
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

  async handleSocketDisconnect(userId: string) {
    try {
      console.log('disconnected user', userId);

      const connectedSocket: string[] = await getRedisValue(
        SOCKET_CONNECT_USERS,
      );

      const removedDisconnectedUser = connectedSocket.filter(
        (id) => userId !== id,
      );

      setRedisValue(
        SOCKET_CONNECT_USERS,
        JSON.stringify(removedDisconnectedUser),
      );
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.USER_NOT_EXIST);
    }
  }
}
