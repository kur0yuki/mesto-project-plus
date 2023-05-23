import { constants } from 'http2';
import BaseError from './BaseError';

export default class DuplicateFieldError extends BaseError {
  constructor(reason?: string) {
    super(reason);
    this.code = constants.HTTP_STATUS_CONFLICT;
    this.message = reason || 'Пользователь уже существует';
  }
}
