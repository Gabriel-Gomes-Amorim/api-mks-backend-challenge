import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserController } from '../user.controller';
import { Request, Response } from 'express';

describe('UserController', () => {
  let userController: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
      controllers: [UserController],
    }).compile();

    userController = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userController).toBeDefined();
  });

  it('should return user Entity in createUser', async () => {
    const createUserDto = {
      fullName: 'John Doe',
      cpf: '12345678901',
      email: 'john@example.com',
      password: 'password123',
    };

    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const user = await userController.create(createUserDto, res, req);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuário cadastrado com sucesso!',
      user,
    });
  });

  it('should update a user by id', async () => {
    const id = '90dcb9a0-eb6e-470e-b689-3c7120ca9f43';
    const updateUserDto = {
      fullName: 'Updated Name',
    };
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const updateUser = await userController.update(id, updateUserDto, res, req);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuário atualizado com sucesso!',
      user: updateUser,
    });
  });
});
