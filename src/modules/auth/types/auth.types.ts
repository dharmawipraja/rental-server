import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginReturnType {
  @Field()
  expiresIn: string;

  @Field()
  accessToken: string;
}
