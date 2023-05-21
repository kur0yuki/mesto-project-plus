import express, { json, Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './routes';

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
app.use('/', router);

app.listen(PORT);
