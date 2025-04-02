import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema'; // Updated to schema
import { CreateUserDto, LoginUserDto } from './users.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ message: string; token: string }> {
    try {
      const { username, password } = createUserDto;

      // Check if username already exists
      const existingUser = await this.userModel.findOne({ username });
      if (existingUser) {
        throw new BadRequestException('Username already exists.');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const newUser = new this.userModel({
        username,
        password: hashedPassword,
      });
      await newUser.save();

      // Generate JWT token
      const token = this.jwtService.sign({ id: newUser._id, username: newUser.username });

      return { message: 'User registered successfully!', token };
    } catch (error) {
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Registration failed. Please try again.');
    }
  }

  // Login method remains similar, just update to use Mongoose
  async login(loginUserDto: LoginUserDto): Promise<{ message: string; token: string }> {
    const { username, password } = loginUserDto;

    const user = await this.userModel.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const token = this.jwtService.sign({ id: user._id, username: user.username });
    return { message: 'Login successful!', token };
  }
}