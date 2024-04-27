import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './entities/movie.entity';
import { UpdateMovieDto } from './dto/update-movie.dto';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('create')
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    try {
      const movie: Movie = await this.movieService.create(createMovieDto);

      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Filme cadastrado com sucesso!', movie });
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Erro ao criar filme!', error: error.message });
    }
  }

  @Get()
  async showAll(@Res() res: Response, @Req() req: Request): Promise<Response> {
    try {
      const movies: Movie[] = await this.movieService.findAll();

      return res.status(HttpStatus.OK).json(movies);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Erro ao buscar filmes', error: error.message });
    }
  }

  @Get(':id')
  async show(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    try {
      const movie: Movie = await this.movieService.findById(id);

      return res.status(HttpStatus.OK).json(movie);
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Erro ao buscar filme!', error: error.message });
    }
  }

  @Patch('update/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateMovieDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    try {
      const updateMovie: Movie = await this.movieService.update(id, data);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Filme atualizado com sucesso!', updateMovie });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao atualizar o filme!',
        error: error.message,
      });
    }
  }

  @Delete('delete/:id')
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<void> {
    return this.movieService.delete(id);
  }
}
