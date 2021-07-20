import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Length, IsEmail, Min, Max, IsNotEmpty } from 'class-validator';

@InputType()
export class UserInput {
  @Field()
  @Length(1, 30)
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @Length(3, 30)
  @IsNotEmpty()
  password: string;
}

@ArgsType()
export class UserArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;
}
