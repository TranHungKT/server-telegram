import http from 'http';
import socket from 'socket.io';

import {
  SOCKET_CONNECT_USERS,
  SOCKET_ERROR_TYPE,
  SOCKET_EVENTS,
} from '@Constants';
import { SendNewMessagePayload } from '@Controllers/socketControllers/helpers/schemas';
import { sendMessageController } from '@Controllers/socketControllers/sendMessageController';
import { MessageStatus } from '@Models';
import { messageService, userService } from '@Services';
import {
  SocketError,
  getRedisValue,
  normalizedUser,
  setRedisValue,
} from '@Utils';

import AuthenticationSocket from './authenticationSocket';

export default class SocketServer extends AuthenticationSocket {
  constructor(expressServer: http.Server) {
    super(expressServer);
  }

  async connectSocket() {
    this.authenticationSocket();

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
              await this.sendPayloadBySocketRoom({
                payload,
                event: SOCKET_EVENTS.OFFER_FOR_CALL_EVENT,
                socket,
              });
              break;
            case SOCKET_EVENTS.ANSWER_FOR_CALL_EVENT:
              await this.sendPayloadBySocketRoom({
                payload,
                event: SOCKET_EVENTS.ANSWER_FOR_CALL_EVENT,
                socket,
              });
              break;
            case SOCKET_EVENTS.ICE_CANDIDATE_EVENT:
              await this.sendPayloadBySocketRoom({
                payload,
                event: SOCKET_EVENTS.ICE_CANDIDATE_EVENT,
                socket,
              });
              break;
            case SOCKET_EVENTS.HANG_UP_EVENT:
              await this.sendPayloadBySocketRoom({
                payload,
                event: SOCKET_EVENTS.HANG_UP_EVENT,
                socket,
              });
              break;
            case SOCKET_EVENTS.TOOGLE_AUDIO_EVENT:
              await this.sendPayloadBySocketRoom({
                payload,
                event: SOCKET_EVENTS.TOOGLE_AUDIO_EVENT,
                socket,
              });
              break;
            case SOCKET_EVENTS.TOOGLE_VIDEO_EVENT:
              await this.sendPayloadBySocketRoom({
                payload,
                event: SOCKET_EVENTS.TOOGLE_VIDEO_EVENT,
                socket,
              });
              break;
          }
        } catch (error) {
          console.log(error);
          this.handleSocketError(error as SocketError, socket.id);
        }
      });
    });
  }

  async sendPayloadBySocketRoom({
    payload,
    event,
    socket,
  }: {
    payload: any;
    event: string;
    socket: socket.Socket;
  }) {
    try {
      socket.broadcast.to(payload.groupId).emit(event, payload);
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
