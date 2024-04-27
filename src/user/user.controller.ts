import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post('create')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    try {
      const user: User = await this.userService.create(createUserDto);

      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Usuário cadastrado com sucesso!', user });
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Erro ao criar usuário!', error: error.message });
    }
  }

  @Get()
  async showAll(@Res() res: Response, @Req() req: Request): Promise<Response> {
    try {
      const users: User[] = await this.userService.findAll();

      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Erro ao buscar usuários', error: error.message });
    }
  }

  @Get(':id')
  async show(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    try {
      const user: User = await this.userService.findById(id);

      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Erro ao buscar usuário!', error: error.message });
    }
  }

  @Patch('update/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    try {
      const updateUser: User = await this.userService.update(id, data);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Usuário atualizado com sucesso!', updateUser });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Erro ao atualizar o usuário!',
        error: error.message,
      });
    }
  }

  @Delete('delete/:id')
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<void> {
    return this.userService.delete(id);
  }
}
