import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import getErrorResponse from '../ErrorMessage';
import BaseError from '../errors/BaseError';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import DuplicateFieldError from '../errors/DuplicateFieldError';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  let customError: BaseError = err instanceof BaseError ? err : new BaseError('Ошибка сервера');
  if (err instanceof Error.DocumentNotFoundError) {
    customError = new NotFoundError(err.message);
  } else if (err instanceof Error.ValidationError || err instanceof Error.CastError) {
    customError = new BadRequestError();
  } else if (err.code === 11000) {
    customError = new DuplicateFieldError();
  }
  res.status(customError.code).send(getErrorResponse(customError.message));

  next();
};
