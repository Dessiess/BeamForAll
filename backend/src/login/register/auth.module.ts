/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User], 'authConnection'),
    JwtModule.register({
      secret: 'your-secret-key', // Replace with a secure secret in production
      signOptions: { expiresIn: '1h' }, // Configure token expiration
   }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
