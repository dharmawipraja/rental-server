import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@ObjectType({ description: 'User model' })
@Schema()
export class User {

  @Field()
  @Prop({ required: true })
  username: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Field()
  @Prop({ required: true })
  password: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
