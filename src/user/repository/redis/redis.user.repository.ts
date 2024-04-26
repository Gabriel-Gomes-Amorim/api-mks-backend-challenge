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
}
