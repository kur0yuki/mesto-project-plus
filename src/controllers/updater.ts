import mongoose, { Error } from 'mongoose';
import { constants } from 'http2';
import { Response } from 'express';
import getErrorResponse from '../ErrorMessage';

const updater = (
  model: mongoose.Model<any>,
  id: string,
  updateQuery: object,
  res: Response,
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
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send(getErrorResponse(notFoundText));
      }
      if (e instanceof Error.ValidationError || e instanceof Error.CastError) {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send(getErrorResponse('Переданы некорректные данные'));
      }
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(getErrorResponse('Ошибка сервера'));
    });
};

export default updater;
