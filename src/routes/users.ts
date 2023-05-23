import { Router } from 'express';
import {
  createUser, getUserById, getUserInfo, getUsers, login, updateUser, updateUserAvatar,
} from '../controllers/users';
import auth from '../middlewares/auth';

const { celebrate, Joi } = require('celebrate');

const router = Router();

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string(),
    avatar: Joi.link(),
    about: Joi.string(),
  }),
}), createUser);
router.use(auth);
router.get('/', getUsers);
router.patch('/me', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string(),
      about: Joi.string(),
    }),
}), updateUser);
router.get('/me', getUserInfo);
router.get('/:userId', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .alphanum()
        .length(24),
    }),
}), getUserById);
router.patch('/me/avarar', celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.link().required(),
    }),
}), updateUserAvatar);

export default router;
