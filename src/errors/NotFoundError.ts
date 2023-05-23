import { constants } from 'http2';
import BaseError from './BaseError';

export default class NotFoundError extends BaseError {

  constructor(reason?: string) {
    super(reason);
    this.code = constants.HTTP_STATUS_NOT_FOUND;
    this.message = reason || 'Страница не найдена';
  }
}
