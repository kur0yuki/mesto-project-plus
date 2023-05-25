import mongoose, { Error } from 'mongoose';
import { NextFunction, Response } from 'express';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

const updater = (
  model: mongoose.Model<any>,
  id: string,
  updateQuery: object,
  res: Response,
  next: NextFunction,
  notFoundText: string,
  selected?: Object,
  populated?: string,
) => {
  model.findByIdAndUpdate(id, updateQuery, { new: true, runValidators: true })
    .select(selected).populate(populated || '', populated ? selected : '')
    .orFail()
    .then((item) => res.send(item))
    .catch((e) => {
      if (e instanceof Error.DocumentNotFoundError) {
        return next(new NotFoundError());
      }
      if (e instanceof Error.CastError) {
        return next(new BadRequestError());
      }
      return next(e);
    });
};

export default updater;
