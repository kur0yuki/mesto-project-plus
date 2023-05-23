import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError';

export const { KEY = 'secret-key' } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  //  const token = req.header('Authorization')?.replace('Bearer ', '');
  const { token } = req.cookies;

  if (!token) return next(new UnauthorizedError());

  jwt.verify(token, KEY, (err: any, user: any) => {
    if (err) next(err);
    req.user = { _id: user._id };
  });
  return next();
};
