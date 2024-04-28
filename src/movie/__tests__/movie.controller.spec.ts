import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { MovieService } from '../movie.service';
import { MovieController } from '../movie.controller';
import { Request, Response } from 'express';

describe('MovieController', () => {
  let movieController: MovieController;
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MovieService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
      controllers: [MovieController],
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(movieController).toBeDefined();
  });

  describe('create', () => {
    it('should return movie Entity in createMovie', async () => {
      const createMovieDto = {
        title: 'Interstellar',
        director: 'Christopher Nolan',
        gender: 'Drama',
        synopsis:
          "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        releaseYear: 2014,
      };

      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const movie = await movieController.create(createMovieDto, res, req);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Filme cadastrado com sucesso!',
        movie: movie,
      });
    });
  });

  describe('update', () => {
    it('should update a movie by id', async () => {
      const id = '808c03a2-939f-4110-a669-f051df64a487';
      const updateMovieDto = {
        title: 'Inception',
        director: 'Christopher Nolan',
      };
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const updateMovie = await movieController.update(
        id,
        updateMovieDto,
        res,
        req,
      );

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Filme atualizado com sucesso!',
        movie: updateMovie,
      });
    });
  });
});
