import { Server, Socket } from 'socket.io'
import http from 'http'
import { Express } from 'express'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { SOCKET_EVENTS } from './constants/listOfSocketEvents'

export default class SocketServer {
  private socketServer: http.Server
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  private expressServer: Express
  constructor(expressServer: Express) {
    this.expressServer = expressServer
    this.socketServer = http.createServer(expressServer)
    this.io = new Server(this.socketServer)
  }

  async connectSocket() {
    this.io.listen(3001)

    this.io.on('connection', (socket) => {
      console.log('a user connected', socket.id)

      socket.onAny(async (event, ...args) => {
        try {
          console.log(args)

          const payload = args[0]
          switch (event) {
            case SOCKET_EVENTS.JOIN_ROOM:
              await this.joinRoom({ socket, roomId: payload })
          }
        } catch (error) {
          socket.emit('Error', 'Something went wrong')
        }
      })
    })
  }

  async joinRoom({ socket, roomId }: { socket: Socket; roomId: string }) {
    try {
      await socket?.join(roomId)
      throw new Error('test')
    } catch (error) {
      throw new Error('test')
    }
  }
}