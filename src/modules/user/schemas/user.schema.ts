import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as bcryptjs from 'bcryptjs';

export type UserDocument = User & Document;

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

@ObjectType({ description: 'User model' })
@Schema()
export class User extends Document {
  @Field()
  _id: string;

  @Prop({
    required: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    unique: true
  })
  @Field()
  email: string;

  @Prop({
    required: true,
    unique: true
  })
  @Field()
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  @Field()
  lastLogin: Date;

  @Field()
  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop({ default: false })
  @Field()
  locked: boolean;

  @Prop()
  @Field()
  resetToken: string;

  @Prop()
  @Field()
  resetTokenExpired: Date;

  @Prop()
  @Field()
  updatedAt: Date;

  @Prop()
  @Field()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', function (next) {
  // Only hash the password if the field has been modified. In other words, don't generate
  // a new hash each time the user doc is saved.
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password before saving
  this.password = bcryptjs.hashSync((this as any).password, 10);

  next();
});
