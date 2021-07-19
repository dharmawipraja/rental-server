import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UserInput, UserArgs } from './types/user.types';
import { User } from './models/User.model';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => User)
  async getUserById(@Args('id') id: string): Promise<User> {
    return await this.usersService.findById(id);
  }

  @Query(returns => [User])
  async getUsers(@Args() userArgs: UserArgs): Promise<User[]> {
    return await this.usersService.findAll(userArgs);
  }

  @Mutation(returns => User)
  async createUser(
    @Args('userData') userData: UserInput,
  ): Promise<User> {
    return await this.usersService.createUser(userData);
  }

  @Mutation(returns => Boolean)
  async deleteUser(@Args('id') id: string) {
    return await this.usersService.deleteById(id);
  }

}