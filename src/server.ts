import 'module-alias/register'
import express, { Express } from 'express'
import { router } from './routers'
import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import { CustomError } from '@Utils'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
// import './consumer'
import { initDb } from '@Configs'
import http from 'http'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

const PORT = process.env.PORT || 3000

export default class App {
  private server: Express
  private serverForSocket: http.Server
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

  constructor() {
    this.server = express()
    this.serverForSocket = http.createServer(this.server)
    this.io = new Server(this.serverForSocket)
  }

  private async initServer() {
    this.server.use(cors())
    this.server.use(
      session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SECRET_SESSION || 'secret',
      }),
    )

    initDb()

    this.server.use(passport.initialize())
    this.server.use(passport.session())

    this.server.use(express.json())
    this.server.use(router)

    this.server.use(
      (error: Error, req: Request, res: Response, _: NextFunction) => {
        if (error instanceof CustomError) {
          return res
            .status(error.statusCode)
            .send({ error: error.serializeErrors() })
        }

        return res.status(400).send({
          error: [
            {
              message: 'Something went wrong',
            },
          ],
        })
      },
    )
  }

  async emitConnectedSocket() {
    this.io.listen(3001)

    this.io.on('connection', (socket) => {
      console.log('a user connected', socket.id)
    })
  }

  async start() {
    this.initServer()
    this.emitConnectedSocket()

    this.server.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`),
    )
  }
}

const app = new App()

app.start()
