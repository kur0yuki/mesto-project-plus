import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import updater from './updater';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import { KEY } from '../middlewares/auth';
import DuplicateFieldError from '../errors/DuplicateFieldError';

const returnedFields = {
  __v: 0,
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({}, returnedFields)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      name, about, avatar, email, password: hashedPassword,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((e) => {
      if (e instanceof Error.ValidationError) {
        return next(new BadRequestError());
      }
      if (e.code === 11000) {
        return next(new DuplicateFieldError());
      }
      return next(e);
    });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  User.findById(id, returnedFields).orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof Error.DocumentNotFoundError) {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      if (e instanceof Error.CastError) {
        return next(new BadRequestError());
      }
      return next(e);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user._id;
  const { name, about } = req.body;
  updater(User, id, { name, about }, res, next, 'Запрашиваемый пользователь не найден', returnedFields);
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user._id;
  const { avatar } = req.body;
  updater(User, id, { avatar }, res, next, 'Запрашиваемый пользователь не найден', returnedFields);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, KEY, { expiresIn: '7d' });
      res.cookie('token', token, {
        sameSite: true,
        httpOnly: true,
        maxAge: 7 * 24 * 3600 * 1000,
      }).send({ success: true });
    })
    .catch(next);
};

export const getUserInfo = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user._id, returnedFields).orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof Error.DocumentNotFoundError) return next(new NotFoundError('Пользователь не найден'));
      return next(e);
    });
};
