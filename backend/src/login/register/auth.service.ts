/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto, LoginUserDto } from './users.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User, 'authConnection') // Using custom database connection
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    try {
      const { username, password } = createUserDto;

      // Check if username already exists
      const existingUser = await this.userRepository.findOne({where: { username }});

      if (existingUser) {
        throw new BadRequestException('Username already exists.');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const newUser = this.userRepository.create({
        username,
        password: hashedPassword,
      });
      await this.userRepository.save(newUser);

      return { message: 'User registered successfully!' };
    } catch (error) {
      console.error('Registration error:', error); // This will log more details
      throw new InternalServerErrorException('Registration failed. Please try again.');
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ message: string; token: string }> {
    const { username, password } = loginUserDto;

    // Find the user by username
    const user = await this.userRepository.findOne({where: { username }});

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Generate a JWT token (replace with actual token generation logic)
    const token = this.jwtService.sign({ id: user.id, username: user.username }, { expiresIn: '8h' });

    return { message: 'Login successful!', token };
  }
}
