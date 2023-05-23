import { constants } from 'http2';
import BaseError from './BaseError';

export default class UnauthorizedError extends BaseError {
  constructor(reason?: string) {
    super(reason);
    this.code = constants.HTTP_STATUS_UNAUTHORIZED;
    this.message = reason || 'Неверный логин или пароль';
  }
}
