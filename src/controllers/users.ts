import { Request, Response } from 'express';
import { Error } from 'mongoose';
import User from '../models/user';
import getErrorResponse from '../ErrorMessage';

const returnedFields = {
  __v: 0,
};

export const getUsers = (req: Request, res: Response) => {
  User.find({}, returnedFields)
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(500).send(getErrorResponse('Ошибка сервера'));
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
      if (e instanceof Error.ValidationError) {
        return res.status(400).send(getErrorResponse('Переданы некорректные данные'));
      }
      return res.status(500).send(getErrorResponse('Ошибка сервера'));
    });
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.userId;
  User.findById(id, returnedFields)
    .then((user) => {
      if (!user) return res.status(404).send(getErrorResponse('Запрашиваемый пользователь не найден'));
      return res.send(user);
    })
    .catch(() => {
      res.status(500).send(getErrorResponse('Ошибка сервера'));
    });
};

export const updateUser = (req: Request, res: Response) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { $set: { name, about } }, { new: true }).select(returnedFields)
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof Error.ValidationError) {
        return res.status(400).send(getErrorResponse('Переданы некорректные данные'));
      }
      return res.status(500).send(getErrorResponse('Ошибка сервера'));
    });
};

export const updateUserAvatar = (req: Request, res: Response) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { $set: { avatar } }, { new: true }).select(returnedFields)
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof Error.ValidationError) {
        return res.status(400).send(getErrorResponse('Переданы некорректные данные'));
      }
      return res.status(500).send(getErrorResponse('Ошибка сервера'));
    });
};
