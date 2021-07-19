import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';

const MONGO_URI = 'mongodb+srv://praja-admin:AiPyaUe2adWOFRZx@db-ngajar-cluster0.4aygc.mongodb.net/db_ngajar?retryWrites=true&w=majority';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(MONGO_URI),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
