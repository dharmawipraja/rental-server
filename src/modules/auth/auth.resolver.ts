import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginReturnType } from './types/auth.types';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => LoginReturnType)
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    const token = await this.authService.login(email, password);

    return token;
  }
}
