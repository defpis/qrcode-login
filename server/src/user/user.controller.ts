import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserResponseDto } from './user.dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<UserResponseDto> {
    const newUser = await this.userService.createUser(user);
    return plainToInstance(UserResponseDto, newUser, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.userService.getUsers();
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }
}
