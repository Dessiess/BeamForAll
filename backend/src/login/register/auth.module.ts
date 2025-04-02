/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
  MongooseModule.forRoot('mongodb://localhost:27017/auth'), // Adjust connection string
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'your-secret-key', // Replace with a secure secret in production
      signOptions: { expiresIn: '1h' }, // Configure token expiration
   }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
