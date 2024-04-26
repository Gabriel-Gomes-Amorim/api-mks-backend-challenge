import { FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { IdNotFoundException } from 'src/utils/errors/id-not-found';

export const selectFieldsUser: FindOptionsSelect<User> = {
  id: true,
  fullName: true,
  cpf: true,
  email: true,
  password: true,
  createdAt: true,
  updatedAt: true,
};

export default class UserRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async create(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  public async update(id: string, data: Partial<User>): Promise<User | null> {
    const user: User = await this.userRepository.findOneBy({ id });

    if (!user) throw new IdNotFoundException(id);

    this.userRepository.merge(user, data);

    const updatedUser: User = await this.userRepository.save(user);

    return updatedUser;
  }

  async findAll(): Promise<User[]> {
    const findUsers: User[] = await this.userRepository.find();

    return findUsers;
  }

  public async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
      select: selectFieldsUser,
    });

    if (!user) throw new IdNotFoundException(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  public async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
