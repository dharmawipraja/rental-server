import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { UserInput, UserArgs } from './types/user.types';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async getUserById(@Args('id') id: string): Promise<User> {
    return await this.userService.findById(id);
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
}
