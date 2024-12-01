/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface'; // Correct the path to where you save the interface

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key',  // Make sure this key matches the one used in your `AuthService` to sign the token
    });
  }

  async validate(payload: JwtPayload) {
    // You can return the user or any info you need from the decoded token
    return { userId: payload.id, username: payload.username };
  }
}
