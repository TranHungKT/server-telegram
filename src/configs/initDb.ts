import mongoose from 'mongoose'

export const initDb = async () =>
  await mongoose
    .connect(`${process.env.MONGO_URI}`, {})
    // eslint-disable-next-line no-console
    .then(() => console.log('MongoDb connected'))
    // eslint-disable-next-line
    .catch((err: Error) => console.log(err))
