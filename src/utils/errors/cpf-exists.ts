import { HttpException, HttpStatus } from '@nestjs/common';

export class CpfException extends HttpException {
  constructor() {
    super('Cpf informado já possui cadastro!', HttpStatus.BAD_REQUEST);
  }
}
