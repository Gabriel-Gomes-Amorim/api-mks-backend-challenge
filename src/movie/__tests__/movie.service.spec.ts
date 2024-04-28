import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from '../movie.service';
import { Movie } from '../entities/movie.entity';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { MovieRepository } from '../repository/movie.repository';
import { TitleMovieException } from '../../utils/errors/title-movie-exists';
import { IdNotFoundException } from '../../utils/errors/id-not-found';

describe('MovieService', () => {
  let service: MovieService;
  let movieRepository: MovieRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: MovieRepository,
          useValue: {
            findByName: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    movieRepository = module.get<MovieRepository>(MovieRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Movie Title',
        director: 'Director Name',
        gender: 'Action',
        releaseYear: 2022,
        synopsis: 'Movie Synopsis',
      };

      const newMovie: Movie = {
        id: '1',
        ...createMovieDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      (movieRepository.findByName as jest.Mock).mockResolvedValue(null);
      (movieRepository.create as jest.Mock).mockReturnValue(newMovie);
      (movieRepository.save as jest.Mock).mockResolvedValue(newMovie);

      const createdMovie = await service.create(createMovieDto);

      expect(createdMovie).toEqual(newMovie);
      expect(movieRepository.findByName).toHaveBeenCalledWith(
        createMovieDto.title,
      );
      expect(movieRepository.create).toHaveBeenCalledWith(createMovieDto);
      expect(movieRepository.save).toHaveBeenCalledWith(newMovie);
    });

    it('should throw TitleMovieException if movie title already exists', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Existing Movie',
        director: 'Director Name',
        gender: 'Action',
        releaseYear: 2022,
        synopsis: 'Movie Synopsis',
      };

      (movieRepository.findByName as jest.Mock).mockResolvedValue({} as Movie);

      await expect(service.create(createMovieDto)).rejects.toThrow(
        TitleMovieException,
      );
      expect(movieRepository.findByName).toHaveBeenCalledWith(
        createMovieDto.title,
      );
      expect(movieRepository.create).not.toHaveBeenCalled();
      expect(movieRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const movies: Movie[] = [
        {
          id: '1',
          title: 'Movie 1',
          director: 'Director 1',
          gender: 'Action',
          releaseYear: 2022,
          synopsis: 'Synopsis 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        // Add more movie objects as needed
      ];

      (movieRepository.findAll as jest.Mock).mockResolvedValue(movies);

      const foundMovies = await service.findAll();

      expect(foundMovies).toEqual(movies);
      expect(movieRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return the movie with the given id', async () => {
      const movieId = '1';
      const movie: Movie = {
        id: movieId,
        title: 'Movie Title',
        director: 'Director Name',
        gender: 'Action',
        releaseYear: 2022,
        synopsis: 'Movie Synopsis',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      (movieRepository.findById as jest.Mock).mockResolvedValue(movie);

      const foundMovie = await service.findById(movieId);

      expect(foundMovie).toEqual(movie);
      expect(movieRepository.findById).toHaveBeenCalledWith(movieId);
    });

    it('should return null if movie with given id does not exist', async () => {
      const movieId = '1';

      (movieRepository.findById as jest.Mock).mockResolvedValue(null);

      const foundMovie = await service.findById(movieId);

      expect(foundMovie).toBeNull();
      expect(movieRepository.findById).toHaveBeenCalledWith(movieId);
    });
  });

  describe('update', () => {
    it('should update the movie with the given id', async () => {
      const movieId = '1';
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Title',
      };
      const updatedMovie: Movie = {
        id: movieId,
        title: 'Updated Title',
        director: 'Director Name',
        gender: 'Action',
        releaseYear: 2022,
        synopsis: 'Movie Synopsis',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      (movieRepository.findById as jest.Mock).mockResolvedValue(updatedMovie);
      (movieRepository.update as jest.Mock).mockResolvedValue(updatedMovie);

      const result = await service.update(movieId, updateMovieDto);

      expect(result).toEqual(updatedMovie);
      expect(movieRepository.findById).toHaveBeenCalledWith(movieId);
      expect(movieRepository.update).toHaveBeenCalledWith(
        movieId,
        updateMovieDto,
      );
    });

    it('should throw IdNotFoundException if movie with given id does not exist', async () => {
      const movieId = '1';
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Title',
      };

      (movieRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.update(movieId, updateMovieDto)).rejects.toThrow(
        IdNotFoundException,
      );
      expect(movieRepository.findById).toHaveBeenCalledWith(movieId);
      expect(movieRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete the movie with the given id', async () => {
      const movieId = '1';

      await service.delete(movieId);

      expect(movieRepository.delete).toHaveBeenCalledWith(movieId);
    });
  });
});
