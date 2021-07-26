import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { JwtPayload } from './types/jwt.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  validatePassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password);
  }

  async createToken(user: User) {
    const accessToken = this.jwtService.sign({
      email: user.email,
      sub: user._id
    });

    return {
      expiresIn: '24h',
      accessToken
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new HttpException(
        'Invalid email/password',
        HttpStatus.UNAUTHORIZED
      );
    }

    if (user.locked) {
      throw new HttpException('Account locked', HttpStatus.UNAUTHORIZED);
    }

    if (!user.confirmed) {
      throw new HttpException(
        'Please confirm your email',
        HttpStatus.UNAUTHORIZED
      );
    }

    if (!this.validatePassword(user, password)) {
      await this.userService.handleInvalidPassword(user);
      throw new HttpException(
        'Invalid email/password',
        HttpStatus.UNAUTHORIZED
      );
    }

    await this.userService.handleSuccessfulLogin(user);

    return this.createToken(user);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
