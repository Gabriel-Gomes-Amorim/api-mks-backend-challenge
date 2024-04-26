import { User } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(user: User): Promise<User>;

  abstract update(id: string, user: Partial<User>): Promise<User | null>;

  abstract findAll(): Promise<User[] | null>;

  abstract findById(id: string): Promise<User | null>;

  abstract findByEmail(email: string): Promise<User | null>;

  abstract save(user: User): Promise<User>;

  abstract delete(id: string): void;
}
