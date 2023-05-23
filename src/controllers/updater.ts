import mongoose from 'mongoose';
import { NextFunction, Response } from 'express';

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
    .catch(next);
};

export default updater;
