import {
  NextFunction, Request, Response, Router,
} from 'express';
import { celebrate, Joi } from 'celebrate';
import cardRouter from './cards';
import userRouter from './users';
import auth from '../middlewares/auth';
import { createUser, login } from '../controllers/users';
import NotFoundError from '../errors/NotFoundError';

const router = Router();

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string(),
    avatar: Joi.string().uri(),
    about: Joi.string(),
  }),
}), createUser);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req: Request, res: Response, next: NextFunction) => next(new NotFoundError()));

export default router;
