import { Express } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { SendNewMessagePayload } from '@Controllers/socketControllers/helpers/schemas';
import { sendMessageController } from '@Controllers/socketControllers/sendMessageController';

import { SOCKET_EVENTS } from './constants/listOfSocketEvents';

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
            case SOCKET_EVENTS.MESSAGE:
              await this.sendMessage(payload, socket);
              break;
          }
        } catch (error) {
          socket.emit('Error', 'Something went wrong');
        }
      });
    });
  }

  async joinRoom({ socket, roomId }: { socket: Socket; roomId: string }) {
    try {
      console.log('a user join room', roomId);
      await socket?.join(roomId);
    } catch (error) {
      throw new Error('Can not join this room');
    }
  }

  async sendMessage(
    payload: {
      message: SendNewMessagePayload;
      roomId: string;
    },
    socket: Socket,
  ) {
    const newMessage = await sendMessageController({
      message: payload.message,
      groupMessageBelongTo: payload.roomId,
    });
    socket.broadcast.to(payload.roomId).emit('get-message', newMessage);
  }
}
