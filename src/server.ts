import cors from 'cors';
import 'dotenv/config';
import express, { Express } from 'express';
import { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import http from 'http';
import 'module-alias/register';
import passport from 'passport';

import { initDb } from '@Configs';
import { CustomError } from '@Utils';

import { routers } from './routers';
import SocketServer from './socket';

const PORT = process.env.PORT || 3000;

export default class App {
  private server: Express;
  private app: http.Server;

  constructor() {
    this.server = express();
    this.app = http.createServer(this.server);
  }

  private async initServer() {
    this.server.use(cors());
    this.server.use(
      session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SECRET_SESSION || 'secret',
      }),
    );

    initDb();

    this.server.use(passport.initialize());
    this.server.use(passport.session());

    this.server.use(express.json());

    this.server.use(routers);

    this.server.use(
      (error: Error, req: Request, res: Response, _: NextFunction) => {
        if (error instanceof CustomError) {
          return res
            .status(error.statusCode)
            .send({ error: error.serializeErrors() });
        }

        console.log(error);
        return res.status(400).send({
          error: [
            {
              message: 'Something went wrong',
            },
          ],
        });
      },
    );
  }

  async initSocketServer() {
    const socket = new SocketServer(this.app);
    socket.connectSocket();
  }

  async start() {
    await this.initServer();
    await this.initSocketServer();

    this.app.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`),
    );
  }
}

const app = new App();

app.start();
