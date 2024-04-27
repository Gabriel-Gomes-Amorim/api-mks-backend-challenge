import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { Movie } from './entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmMovieRepository from './repository/typeorm/typeorm.movie.repository';
import { RedisService } from 'src/database/redis/redis';
import { RedisMovieRepository } from './repository/redis/redis.movie.repository';
import { MovieRepository } from './repository/movie.repository';

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
