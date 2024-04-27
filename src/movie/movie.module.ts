import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from './movie.service';
import { Movie } from './entities/movie.entity';
import { MovieController } from './movie.controller';
import { RedisService } from '../database/redis/redis';
import { MovieRepository } from './repository/movie.repository';
import TypeOrmMovieRepository from './repository/typeorm/typeorm.movie.repository';
import { RedisMovieRepository } from './repository/redis/redis.movie.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MovieController],
  providers: [
    MovieService,
    TypeOrmMovieRepository,
    RedisService,
    RedisMovieRepository,
    { provide: MovieRepository, useClass: RedisMovieRepository },
  ],
  exports: [MovieService, MovieRepository],
})
export class MovieModule {}
