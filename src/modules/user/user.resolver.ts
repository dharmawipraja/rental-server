import { BadRequestException, Response } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserInput, UserArgs } from './types/user.types';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Resolver(User)
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async getUserById(@Args('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async getUserByEmail(@Args('email') email: string): Promise<User> {
    return await this.userService.findOneByEmail(email);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async getProfile(@Response() JwtResponse): Promise<User> {
    try {
      return await this.userService.findOneByEmail(JwtResponse.req.user.email);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Query(() => [User])
  async getUsers(@Args() userArgs: UserArgs): Promise<User[]> {
    return await this.userService.findAll(userArgs);
  }

  @Mutation(() => User)
  async createUser(@Args('userData') userData: UserInput): Promise<User> {
    return await this.userService.createUser(userData);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string) {
    return await this.userService.deleteById(id);
  }

  @Mutation(() => Boolean)
  async confirmUser(@Args('emailToken') emailToken: string) {
    return await this.userService.confirmUser(emailToken);
  }
}
