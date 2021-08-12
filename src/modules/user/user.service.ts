import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import dayjs from 'dayjs';

import { UserInput, UserArgs } from './types/user.types';
import { User, UserDocument } from './schemas/user.schema';
import { handleConfirmationEmail } from 'src/utils/confirmationEmail.utils';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById({ _id: id });
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(email);
    }
    return user;
  }

  async findAll({ skip, limit }: UserArgs): Promise<User[]> {
    const users = await this.userModel.find().skip(skip).limit(limit);
    return users;
  }

  async createUser(userData: UserInput): Promise<User> {
    const { email } = userData;
    const emailToken = this.jwtService.sign({ email: userData.email });
    const createdUser = await this.userModel.create(userData);
    await createdUser.save();

    await this.redis.set(emailToken, email, {
      ttl: 1000 * 3600 * 24
    });
    handleConfirmationEmail(emailToken, createdUser);

    return createdUser;
  }

  async deleteById(id: string): Promise<string> {
    await this.userModel.deleteOne({ id });
    return id;
  }

  async handleSuccessfulLogin(user: User): Promise<void> {
    user.lastLogin = new Date(dayjs().toISOString());
    user.loginAttempts = 0;

    await user.save();
  }

  async handleInvalidPassword(user: User): Promise<void> {
    user.loginAttempts = user.loginAttempts + 1;

    if (user.loginAttempts > 5) {
      user.locked = true;
    }

    await user.save();
  }

  async confirmUser(emailToken: string): Promise<boolean> {
    const email = await this.redis.get(emailToken);
    const user = this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException(email);
    }

    await this.userModel.updateOne({ email }, { confirmed: true });
    await this.redis.del(emailToken);

    return true;
  }
}
