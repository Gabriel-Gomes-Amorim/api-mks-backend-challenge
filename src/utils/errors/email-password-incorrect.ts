import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailOrPasswordInvalidException extends HttpException {
  constructor() {
    super(
      'O endereço de e-mail ou a senha fornecidos estão incorretos.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
