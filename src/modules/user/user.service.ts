import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';

import { UserInput, UserArgs } from './types/user.types';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
    const createdUser = await this.userModel.create(userData);
    await createdUser.save();
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
}
