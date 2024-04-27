import { HttpException, HttpStatus } from '@nestjs/common';

export class TitleMovieException extends HttpException {
  constructor() {
    super('Título informado já existe!', HttpStatus.BAD_REQUEST);
  }
}
