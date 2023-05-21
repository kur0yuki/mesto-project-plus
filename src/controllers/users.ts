import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { constants } from 'http2';
import User from '../models/user';
import getErrorResponse from '../ErrorMessage';
import updater from './updater';

const returnedFields = {
  __v: 0,
};

export const getUsers = (req: Request, res: Response) => {
  User.find({}, returnedFields)
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(getErrorResponse('Ошибка сервера'));
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res.send({
        name, about, avatar, _id: user.id,
      });
    })
    .catch((e) => {
      if (e instanceof Error.ValidationError || e instanceof Error.CastError) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send(getErrorResponse('Переданы некорректные данные'));
      }
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(getErrorResponse('Ошибка сервера'));
    });
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.userId;
  User.findById(id, returnedFields).orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof Error.DocumentNotFoundError) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send(getErrorResponse('Запрашиваемый пользователь не найден'));
      }
      if (e instanceof Error.CastError) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send(getErrorResponse('Переданы некорректные данные'));
      }
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(getErrorResponse('Ошибка сервера'));
    });
};

export const updateUser = (req: Request, res: Response) => {
  const id = req.user._id;
  const { name, about } = req.body;
  updater(User, id, { name, about }, res, 'Запрашиваемый пользователь не найден', returnedFields);
};

export const updateUserAvatar = (req: Request, res: Response) => {
  const id = req.user._id;
  const { avatar } = req.body;
  updater(User, id, { avatar }, res, 'Запрашиваемый пользователь не найден', returnedFields);
};
