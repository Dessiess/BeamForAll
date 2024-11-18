/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto, LoginUserDto } from './users.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { username, password } = createUserDto;

    // Check if username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }],
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists.');
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
  }

  async login(loginUserDto: LoginUserDto): Promise<{ message: string; token: string }> {
    const { username, password } = loginUserDto;

    // Find the user by username
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Generate a JWT token (replace with actual token generation logic)
    const token = `mock-jwt-token-for-${user.id}`;

    return { message: 'Login successful!', token };
  }
}
