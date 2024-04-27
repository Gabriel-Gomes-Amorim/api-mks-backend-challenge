import { Movie } from '../entities/movie.entity';

export abstract class MovieRepository {
  abstract create(
    movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Movie>;

  abstract update(id: string, movie: Partial<Movie>): Promise<Movie | null>;

  abstract findAll(): Promise<Movie[] | null>;

  abstract findById(id: string): Promise<Movie | null>;

  abstract findByName(title: string): Promise<Movie | null>;

  abstract save(movie: Movie): Promise<Movie>;

  abstract delete(id: string): Promise<void>;
}
