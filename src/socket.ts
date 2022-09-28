import { Express } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { SOCKET_ERROR_TYPE, SOCKET_EVENTS } from '@Constants';
import { SendNewMessagePayload } from '@Controllers/socketControllers/helpers/schemas';
import { sendMessageController } from '@Controllers/socketControllers/sendMessageController';

import { SocketError } from './utils/customsError';

export default class SocketServer {
  private socketServer: http.Server;
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  constructor(expressServer: Express) {
    this.socketServer = http.createServer(expressServer);
    this.io = new Server(this.socketServer);
  }

  async connectSocket() {
    this.io.listen(3001);

    this.io.on('connection', (socket) => {
      console.log('a user connected', socket.id);

      socket.onAny(async (event, ...args) => {
        try {
          const payload = args[0];
          console.log('payload', payload);
          switch (event) {
            case SOCKET_EVENTS.JOIN_ROOM:
              await this.joinRoom({ socket, roomId: payload });
              break;
            case SOCKET_EVENTS.SEND_MESSAGE:
              await this.sendMessage(payload, socket);
              break;
          }
        } catch (error) {
          console.log(error);
          this.handleSocketError(error as SocketError, socket.id);
        }
      });
    });
  }

  async handleSocketError(error: SocketError, socketId: string) {
    this.io
      .to(socketId)
      .emit(SOCKET_EVENTS.SOCKET_ERROR, error.normarlizeError());
  }

  async joinRoom({ socket, roomId }: { socket: Socket; roomId: string }) {
    try {
      console.log('a user join room', roomId);

      await socket?.join(roomId);
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.JOIN_ROOM_FAIL);
    }
  }

  async sendMessage(
    payload: {
      message: SendNewMessagePayload;
      roomId: string;
    },
    socket: Socket,
  ) {
    try {
      const newMessage = await sendMessageController({
        message: payload.message,
        groupMessageBelongTo: payload.roomId,
      });
      socket.broadcast.to(payload.roomId).emit('get-message', newMessage);
    } catch (error) {
      throw new SocketError(SOCKET_ERROR_TYPE.SEND_MESSAGE_ERROR);
    }
  }
}
