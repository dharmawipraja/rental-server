import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserInput, UserArgs } from './types/user.types';
import { User } from './models/User.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  async getUserById(@Args('id') id: string): Promise<User> {
    return await this.usersService.findById(id);
  }

  @Query(() => [User])
  async getUsers(@Args() userArgs: UserArgs): Promise<User[]> {
    return await this.usersService.findAll(userArgs);
  }

  @Mutation(() => User)
  async createUser(@Args('userData') userData: UserInput): Promise<User> {
    return await this.usersService.createUser(userData);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string) {
    return await this.usersService.deleteById(id);
  }
}
