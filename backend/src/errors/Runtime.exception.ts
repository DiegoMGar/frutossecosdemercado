import GeneralException from './General.exception';

export class RuntimeException extends GeneralException {
  constructor(message: string) {
    super(message, 'RuntimeException');
  }
}
