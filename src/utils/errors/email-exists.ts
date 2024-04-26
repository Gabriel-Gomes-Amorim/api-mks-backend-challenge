import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailException extends HttpException {
  constructor() {
    super('E-mail informado já possui cadastro!', HttpStatus.BAD_REQUEST);
  }
}
