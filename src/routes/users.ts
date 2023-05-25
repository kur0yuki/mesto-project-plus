import { Router } from 'express';
import {
  getUserById, getUserInfo, getUsers, updateUser, updateUserAvatar,
} from '../controllers/users';

const { celebrate, Joi } = require('celebrate');

const router = Router();

router.get('/', getUsers);
router.patch('/me', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
    }),
}), updateUser);
router.get('/me', getUserInfo);
router.get('/:userId', celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string()
        .alphanum()
        .length(24),
    }),
}), getUserById);
router.patch('/me/avatar', celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string().uri().required(),
    }),
}), updateUserAvatar);

export default router;
