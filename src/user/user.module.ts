import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import TypeOrmUserRepository from './repository/typeorm/typeorm.user.repository';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RedisService } from 'src/database/redis/redis';
import { RedisUserRepository } from './repository/redis/redis.user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    TypeOrmUserRepository,
    RedisService,
    RedisUserRepository,
    { provide: UserRepository, useClass: RedisUserRepository },
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
