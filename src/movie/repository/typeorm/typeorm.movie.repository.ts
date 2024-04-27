import { FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IdNotFoundException } from 'src/utils/errors/id-not-found';
import { Movie } from 'src/movie/entities/movie.entity';
import { MovieRepository } from '../movie.repository';

export const selectFieldsMovie: FindOptionsSelect<Movie> = {
  id: true,
  title: true,
  director: true,
  gender: true,
  releaseYear: true,
  synopsis: true,
  createdAt: true,
  updatedAt: true,
};

export default class TypeOrmMovieRepository implements MovieRepository {
  constructor(
    @InjectRepository(Movie)
    private typeormMovieRepository: Repository<Movie>,
  ) {}

  public async create(
    movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Movie> {
    return this.typeormMovieRepository.create(movie);
  }

  public async update(id: string, data: Partial<Movie>): Promise<Movie | null> {
    const movie: Movie = await this.typeormMovieRepository.findOneBy({ id });

    if (!movie) throw new IdNotFoundException(id);

    this.typeormMovieRepository.merge(movie, data);

    const updatedMovie: Movie = await this.typeormMovieRepository.save(movie);

    return updatedMovie;
  }

  async findAll(): Promise<Movie[]> {
    const findMovie: Movie[] = await this.typeormMovieRepository.find();

    return findMovie;
  }

  public async findById(id: string): Promise<Movie | null> {
    const movie: Movie = await this.typeormMovieRepository.findOne({
      where: { id },
      withDeleted: true,
      select: selectFieldsMovie,
    });

    if (!movie) throw new IdNotFoundException(id);

    return movie;
  }

  async findByName(title: string): Promise<Movie | null> {
    const movie: Movie = await this.typeormMovieRepository.findOne({
      where: { title },
      withDeleted: true,
      select: selectFieldsMovie,
    });

    return movie || null;
  }

  public async save(movie: Movie): Promise<Movie> {
    return this.typeormMovieRepository.save(movie);
  }

  public async delete(id: string): Promise<void> {
    await this.typeormMovieRepository.delete(id);
  }
}
