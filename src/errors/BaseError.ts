import { constants } from 'http2';

export default class BaseError extends Error {
  code: number;

  constructor(reason?: string) {
    super();
    this.code = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    this.message = reason || 'Ошибка сервера';
  }
}
