import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UserInput, UserArgs } from './types/user.types';
import { User, UserDocument } from './models/User.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById({ _id: id });
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  async findAll(userArgs: UserArgs): Promise<User[]> {
    const users = await this.userModel.find(userArgs);
    return users;
  }

  async createUser(userData: UserInput): Promise<User> {
    const createdUser = await this.userModel.create(userData);
    await createdUser.save();
    return createdUser;
  }

  async deleteById(id: string) {
    await this.userModel.deleteOne({ id });
    return id;
  }

}