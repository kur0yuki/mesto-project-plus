import express, { json, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';

const {
  PORT = 3000,
  MONGODB_HOST = 'localhost',
  MONGODB_PORT = 27017,
} = process.env;

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/mestodb`);

app.use(json());
app.use((req: Request, res: Response, next) => {
  req.user = {
    _id: '64680300567f7bbb5e8e2499',
  };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT);
