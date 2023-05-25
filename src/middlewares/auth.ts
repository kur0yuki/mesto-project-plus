import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError';

export const { KEY = 'secret-key' } = process.env;

export interface TRequest extends Request {
  user?: {_id: string}
}

export default (req: TRequest, res: Response, next: NextFunction) => {
  //  const token = req.header('Authorization')?.replace('Bearer ', '');
  const { token } = req.cookies;

  if (!token) return next(new UnauthorizedError());

  jwt.verify(token, KEY, (err: any, user: any) => {
    if (err) next(new UnauthorizedError());
    req.user = { _id: user._id };
  });
  return next();
};
