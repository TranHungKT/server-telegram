import http from 'http';
import socket from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export default class IntializeSocket {
  protected io: socket.Server<
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
}
