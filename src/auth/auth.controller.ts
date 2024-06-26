import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserToken } from './models/UserToken';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guards';

@Controller()
@ApiTags('Login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiParam({ name: 'email', type: 'string', required: true })
  @ApiParam({ name: 'password', type: 'string', required: true })
  login(@Request() req: AuthRequest): Promise<UserToken> {
    return this.authService.login(req.user);
  }
}
