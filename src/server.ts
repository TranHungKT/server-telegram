import 'module-alias/register'
import express from 'express'
import { router } from './routers'
import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import { CustomError } from '@Utils'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
// import './consumer'
import { initDb } from '@Configs'
initDb()

const app = express()
app.use(cors())
const PORT = process.env.PORT || 3000
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla',
  }),
)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(router)

app.use((error: Error, req: Request, res: Response, _: NextFunction) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).send({ error: error.serializeErrors() })
  }

  return res.status(400).send({
    error: [
      {
        message: 'Something went wrong',
      },
    ],
  })
})

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`The server is up and running on ${PORT}`)
})
