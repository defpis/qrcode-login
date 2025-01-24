import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/user.dto';
import { PasswordService } from '../password.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Post('login')
  async login(@Body() user: CreateUserDto) {
    const existedUser = await this.userService.getUser({
      username: user.username,
    });
    if (!existedUser) {
      throw new BadRequestException('用户名不存在');
    }

    const passwordOk = await this.passwordService.verifyPasswordHash(
      user.password,
      existedUser.passwordHash,
    );
    if (!passwordOk) {
      throw new BadRequestException('密码错误');
    }

    const payload = { sub: existedUser.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  @UseGuards(AuthGuard)
  @Get('protected')
  async protected(@Request() req) {
    return { username: req.user.username };
  }
}
