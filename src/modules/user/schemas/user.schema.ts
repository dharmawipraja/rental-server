import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { USERTYPE } from 'src/constants/user.constant';

export type UserDocument = User & Document;

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validateRole = (role) => {
  const {
    ROLES: { ADMIN, USER }
  } = USERTYPE;
  const result = role === ADMIN || role === USER;
  return result;
};

@ObjectType({ description: 'User model' })
@Schema({ timestamps: true })
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

  @Prop({
    default: USERTYPE.ROLES.USER,
    validate: [validateRole, 'Role must be user or admin']
  })
  roles: string;

  @Prop()
  @Field()
  lastLogin: Date;

  @Prop({ default: 0 })
  @Field()
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
