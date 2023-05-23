import express, { json } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import router from './routes';
import errorMiddleware from './middlewares/error';
import { requestLogger, errorLogger } from './middlewares/logger';

const {
  PORT = 3000,
  MONGODB_HOST = 'localhost',
  MONGODB_PORT = 27017,
} = process.env;

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/mestodb`);

app.use(json());
app.use(cookieParser());

app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);

app.use(errors());
app.use(errorMiddleware);

app.listen(PORT);
