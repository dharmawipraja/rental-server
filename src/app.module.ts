import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

const MONGO_URI =
  'mongodb+srv://praja-admin:AiPyaUe2adWOFRZx@db-ngajar-cluster0.4aygc.mongodb.net/db_ngajar?retryWrites=true&w=majority';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      context: ({ req }) => ({ req })
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
