import { Injectable } from '@nestjs/common';
import { IdNotFoundException } from 'src/utils/errors/id-not-found';
import { MovieRepository } from './repository/movie.repository';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TitleMovieException } from 'src/utils/errors/title-movie-exists';

@Injectable()
export class MovieService {
  constructor(private readonly movieRepository: MovieRepository) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { title } = createMovieDto;

    const isTitleAlreadyExists: Movie | null =
      await this.movieRepository.findByName(title);

    if (isTitleAlreadyExists) {
      throw new TitleMovieException();
    }

    const createMovie: Omit<
      Movie,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    > = {
      title: createMovieDto.title,
      director: createMovieDto.director,
      gender: createMovieDto.gender,
      releaseYear: createMovieDto.releaseYear,
      synopsis: createMovieDto.synopsis,
    };

    const newMovie: Movie = await this.movieRepository.create(createMovie);

    const createdMovie: Movie = await this.movieRepository.save(newMovie);

    return {
      ...createdMovie,
    };
  }

  async findAll(): Promise<Movie[] | null> {
    return await this.movieRepository.findAll();
  }

  public async findById(id: string): Promise<Movie | null> {
    return await this.movieRepository.findById(id);
  }

  async update(id: string, data: Partial<UpdateMovieDto>): Promise<Movie> {
    const findMovie: Movie = await this.movieRepository.findById(id);

    if (!findMovie) {
      throw new IdNotFoundException(id);
    }

    const updateMovie: Movie = await this.movieRepository.update(id, data);

    return {
      ...updateMovie,
    };
  }

  async delete(id: string): Promise<void> {
    await this.movieRepository.delete(id);
  }
}
