import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CpfException } from '../../utils/errors/cpf-exists';
import { UserRepository } from '../repository/user.repository';
import { EmailException } from '../../utils/errors/email-exists';
import { IdNotFoundException } from '../../utils/errors/id-not-found';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            findByCpf: jest.fn(),
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

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        fullName: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        password: 'password123',
      };

      const newUser: User = {
        id: '1',
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.findByCpf as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockReturnValue(newUser);
      (userRepository.save as jest.Mock).mockResolvedValue(newUser);

      const createdUser = await service.create(createUserDto);

      expect(createdUser).toEqual({
        ...newUser,
        password: undefined,
      });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(userRepository.findByCpf).toHaveBeenCalledWith(createUserDto.cpf);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.any(String),
      });
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
    });

    it('should throw EmailException if email already exists', async () => {
      const createUserDto = {
        fullName: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        password: 'password123',
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue({} as User);

      await expect(service.create(createUserDto)).rejects.toThrow(
        EmailException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(userRepository.findByCpf).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should throw CpfException if cpf already exists', async () => {
      const createUserDto = {
        fullName: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        password: 'password123',
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.findByCpf as jest.Mock).mockResolvedValue({} as User);

      await expect(service.create(createUserDto)).rejects.toThrow(CpfException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(userRepository.findByCpf).toHaveBeenCalledWith(createUserDto.cpf);
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: User[] = [
        {
          id: '1',
          fullName: 'John Doe',
          cpf: '12345678901',
          email: 'john@example.com',
          password: 'password123',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      (userRepository.findAll as jest.Mock).mockResolvedValue(users);

      const foundUsers = await service.findAll();

      expect(foundUsers).toEqual(users);
      expect(userRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return the user with the given id', async () => {
      const userId = '1';
      const user: User = {
        id: userId,
        fullName: 'John Doe',
        cpf: '12345678901',
        email: 'john@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(user);

      const foundUser = await service.findById(userId);

      expect(foundUser).toEqual(user);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should return null if user with given id does not exist', async () => {
      const userId = '1';

      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      const foundUser = await service.findById(userId);

      expect(foundUser).toBeNull();
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update the user with the given id', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        fullName: 'Updated Name',
      };
      const updatedUser: User = {
        id: userId,
        fullName: 'Updated Name',
        cpf: '12345678901',
        email: 'john@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(updatedUser);
      (userRepository.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(result).toEqual({
        ...result,
        password: undefined,
      });
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.update).toHaveBeenCalledWith(userId, updateUserDto);
    });

    it('should throw IdNotFoundException if user with given id does not exist', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        fullName: 'Updated Name',
      };

      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        IdNotFoundException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return the user with the given email', async () => {
      const userEmail = 'john@example.com';
      const user: User = {
        id: '1',
        fullName: 'John Doe',
        cpf: '12345678901',
        email: userEmail,
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);

      const foundUser = await service.findByEmail(userEmail);

      expect(foundUser).toEqual(user);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userEmail);
    });

    it('should return null if user with given email does not exist', async () => {
      const userEmail = 'john@example.com';

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      const foundUser = await service.findByEmail(userEmail);

      expect(foundUser).toBeNull();
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userEmail);
    });
  });

  describe('delete', () => {
    it('should delete the user with the given id', async () => {
      const userId = '1';

      await service.delete(userId);

      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });
  });
});
