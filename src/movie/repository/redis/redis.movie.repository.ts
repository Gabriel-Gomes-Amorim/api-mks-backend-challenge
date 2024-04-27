import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/database/redis/redis';
import { MovieRepository } from '../movie.repository';
import TypeOrmMovieRepository from '../typeorm/typeorm.movie.repository';
import { Movie } from 'src/movie/entities/movie.entity';

@Injectable()
export class RedisMovieRepository implements MovieRepository {
  constructor(
    private readonly redis: RedisService,
    private readonly typeormMovieRepository: TypeOrmMovieRepository,
  ) {}

  async create(
    movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Movie> {
    return this.typeormMovieRepository.create(movie);
  }

  async findAll(): Promise<Movie[] | null> {
    const cachedMovies: string = await this.redis.get('movies');

    if (!cachedMovies) {
      const movies: Movie[] | null =
        await this.typeormMovieRepository.findAll();

      await this.redis.set('movies', JSON.stringify(movies), 'EX', 15);

      console.log('\x1b[33m%s\x1b[0m', 'From Database');

      return movies;
    }
    console.log('\x1b[36m%s\x1b[0m', 'From Cache');

    return JSON.parse(cachedMovies);
  }

  async findById(id: string): Promise<Movie | null> {
    const cachedMovie: string = await this.redis.get(`movie:id:${id}`);

    if (!cachedMovie) {
      const movie: Movie | null =
        await this.typeormMovieRepository.findById(id);

      if (movie) {
        await this.redis.set(`movie:id:${id}`, JSON.stringify(movie), 'EX', 15);
        console.log('\x1b[33m%s\x1b[0m', 'Movie found in database');
      } else {
        console.log('\x1b[33m%s\x1b[0m', 'Movie not found in database');
      }

      return movie;
    }
    console.log('\x1b[36m%s\x1b[0m', 'Movie found in cache');

    return JSON.parse(cachedMovie);
  }

  async findByName(title: string): Promise<Movie | null> {
    const cachedMovie: string = await this.redis.get(`movie:title:${title}`);

    if (!cachedMovie) {
      const movie: Movie | null =
        await this.typeormMovieRepository.findByName(title);

      if (movie) {
        await this.redis.set(
          `movie:title:${title}`,
          JSON.stringify(movie),
          'EX',
          15,
        );
        console.log('\x1b[33m%s\x1b[0m', 'Movie found in database');
      } else {
        console.log('\x1b[33m%s\x1b[0m', 'Movie not found in database');
      }

      return movie;
    }
    console.log('\x1b[36m%s\x1b[0m', 'Movie found in cache');

    return JSON.parse(cachedMovie);
  }

  save(movie: Movie): Promise<Movie> {
    return this.typeormMovieRepository.save(movie);
  }

  update(id: string, movie: Partial<Movie>): Promise<Movie> {
    return this.typeormMovieRepository.update(id, movie);
  }

  delete(id: string): Promise<void> {
    return this.typeormMovieRepository.delete(id);
  }
}
