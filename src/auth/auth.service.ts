import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserToken } from './models/UserToken';
import { UserService } from '../user/user.service';
import { UserPayload } from './models/UserPayloads';
import { User } from '../user/entities/user.entity';
import { EmailOrPasswordInvalidException } from '../utils/errors/email-password-incorrect';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    const jwtToken: string = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
      user: user,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        user.password,
      );

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new EmailOrPasswordInvalidException();
  }
}
