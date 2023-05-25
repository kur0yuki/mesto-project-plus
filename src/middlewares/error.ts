import { NextFunction, Request, Response } from 'express';
import getErrorResponse from '../ErrorMessage';
import BaseError from '../errors/BaseError';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  const customError: BaseError = err instanceof BaseError ? err : new BaseError('Ошибка сервера');
  res.status(customError.code).send(getErrorResponse(customError.message));

  next();
};
