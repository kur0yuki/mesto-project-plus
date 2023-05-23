import { constants } from 'http2';
import BaseError from './BaseError';

export default class ForbiddenError extends BaseError {
  constructor(reason?: string) {
    super(reason);
    this.code = constants.HTTP_STATUS_FORBIDDEN;
    this.message = reason || 'Недостаточно прав на выполнение операции';
  }
}
