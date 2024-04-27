import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CpfException } from '../utils/errors/cpf-exists';
import { EmailException } from '../utils/errors/email-exists';
import { UserRepository } from './repository/user.repository';
import { IdNotFoundException } from '../utils/errors/id-not-found';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, cpf } = createUserDto;

    const isEmailAlreadyExists: User | null =
      await this.userRepository.findByEmail(email);

    if (isEmailAlreadyExists) {
      throw new EmailException();
    }

    const isCpfAlreadyExists: User | null =
      await this.userRepository.findByCpf(cpf);

    if (isCpfAlreadyExists) {
      throw new CpfException();
    }

    const createUser: Omit<
      User,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    > = {
      fullName: createUserDto.fullName,
      cpf: createUserDto.cpf,
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const newUser: User = await this.userRepository.create(createUser);

    const createdUser: User = await this.userRepository.save(newUser);

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findAll(): Promise<User[] | null> {
    return await this.userRepository.findAll();
  }

  public async findById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async update(id: string, data: Partial<UpdateUserDto>): Promise<User> {
    const findUser: User = await this.userRepository.findById(id);

    if (!findUser) {
      throw new IdNotFoundException(id);
    }

    if (data.password) {
      const hashedPassword: string = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    const updateUser: User = await this.userRepository.update(id, data);

    return {
      ...updateUser,
      password: undefined,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
