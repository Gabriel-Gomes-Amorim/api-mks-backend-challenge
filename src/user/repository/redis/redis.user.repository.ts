import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { RedisService } from 'src/database/redis/redis';
import TypeOrmUserRepository from '../typeorm/typeorm.user.repository';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RedisUserRepository implements Partial<UserRepository> {
  constructor(
    private readonly redis: RedisService,
    private readonly typeormUserRepository: TypeOrmUserRepository,
  ) {}

  create(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<User> {
    return this.typeormUserRepository.create(user);
  }

  update(id: string, user: Partial<User>): Promise<User> {
    return this.typeormUserRepository.update(id, user);
  }

  async findAll(): Promise<User[] | null> {
    const cachedUsers: string = await this.redis.get('users');

    if (!cachedUsers) {
      const users: User[] | null = await this.typeormUserRepository.findAll();

      await this.redis.set('users', JSON.stringify(users), 'EX', 15);

      console.log('\x1b[33m%s\x1b[0m', 'From Database');

      return users;
    }
    console.log('\x1b[36m%s\x1b[0m', 'From Cache');

    return JSON.parse(cachedUsers);
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const cachedUser: string = await this.redis.get(`user:${cpf}`);

    if (!cachedUser) {
      const user: User | null = await this.typeormUserRepository.findByCpf(cpf);

      if (user) {
        await this.redis.set(`user:${cpf}`, JSON.stringify(user), 'EX', 15);
        console.log('\x1b[33m%s\x1b[0m', 'User found in database');
      } else {
        console.log('\x1b[33m%s\x1b[0m', 'User not found in database');
      }

      return user;
    }
    console.log('\x1b[36m%s\x1b[0m', 'User found in cache');

    return JSON.parse(cachedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const cachedUser: string = await this.redis.get(`user:email:${email}`);

    if (!cachedUser) {
      const user: User | null =
        await this.typeormUserRepository.findByEmail(email);

      if (user) {
        await this.redis.set(
          `user:email:${email}`,
          JSON.stringify(user),
          'EX',
          15,
        );
        console.log('\x1b[33m%s\x1b[0m', 'User found in database');
      } else {
        console.log('\x1b[33m%s\x1b[0m', 'User not found in database');
      }

      return user;
    }
    console.log('\x1b[36m%s\x1b[0m', 'User found in cache');

    return JSON.parse(cachedUser);
  }

  async findById(id: string): Promise<User | null> {
    const cachedUser: string = await this.redis.get(`user:id:${id}`);

    if (!cachedUser) {
      const user: User | null = await this.typeormUserRepository.findById(id);

      if (user) {
        await this.redis.set(`user:id:${id}`, JSON.stringify(user), 'EX', 15);
        console.log('\x1b[33m%s\x1b[0m', 'User found in database');
      } else {
        console.log('\x1b[33m%s\x1b[0m', 'User not found in database');
      }

      return user;
    }
    console.log('\x1b[36m%s\x1b[0m', 'User found in cache');

    return JSON.parse(cachedUser);
  }

  save(user: User): Promise<User> {
    return this.typeormUserRepository.save(user);
  }

  delete(id: string): Promise<void> {
    return this.typeormUserRepository.delete(id);
  }
}
