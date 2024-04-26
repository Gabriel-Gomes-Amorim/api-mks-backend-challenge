import { FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { IdNotFoundException } from 'src/utils/errors/id-not-found';
import { UserRepository } from '../user.repository';

export const selectFieldsUser: FindOptionsSelect<User> = {
  id: true,
  fullName: true,
  cpf: true,
  email: true,
  password: true,
  createdAt: true,
  updatedAt: true,
};

export default class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private typeormUserRepository: Repository<User>,
  ) {}

  public async create(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<User> {
    return this.typeormUserRepository.create(user);
  }

  public async update(id: string, data: Partial<User>): Promise<User | null> {
    const user: User = await this.typeormUserRepository.findOneBy({ id });

    if (!user) throw new IdNotFoundException(id);

    this.typeormUserRepository.merge(user, data);

    const updatedUser: User = await this.typeormUserRepository.save(user);

    return updatedUser;
  }

  async findAll(): Promise<User[]> {
    const findUsers: User[] = await this.typeormUserRepository.find();

    return findUsers;
  }

  public async findById(id: string): Promise<User | null> {
    const user = await this.typeormUserRepository.findOne({
      where: { id },
      withDeleted: true,
      select: selectFieldsUser,
    });

    if (!user) throw new IdNotFoundException(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.typeormUserRepository.findOne({
      where: {
        email,
      },
    });
  }

  findByCpf(cpf: string): Promise<User> {
    return this.typeormUserRepository.findOne({
      where: {
        cpf,
      },
    });
  }

  public async save(user: User): Promise<User> {
    return this.typeormUserRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    await this.typeormUserRepository.delete(id);
  }
}
