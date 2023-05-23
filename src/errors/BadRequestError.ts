import { constants } from 'http2';
import BaseError from './BaseError';

export default class BadRequestError extends BaseError {
  constructor(reason?: string) {
    super(reason);
    this.code = constants.HTTP_STATUS_BAD_REQUEST;
    this.message = reason || 'Переданы некорректные данные';
  }
}
