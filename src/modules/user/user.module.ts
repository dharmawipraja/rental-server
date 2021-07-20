import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from './schemas/user.schema';
import { UsersResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersResolver, UserService],
})
export class UsersModule {}
