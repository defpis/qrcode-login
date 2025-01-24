import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import { PasswordService } from '../password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private passwordService: PasswordService,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const existedUser = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (existedUser) {
      throw new BadRequestException('用户名已注册');
    }
    const passwordHash = await this.passwordService.genPasswordHash(
      user.password,
    );
    const newUser = this.userRepository.create({
      username: user.username,
      passwordHash,
    });
    return this.userRepository.save(newUser);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find({ select: ['id', 'username'] }); // 筛选字段不会同步关联类型
  }

  async getUser(where: FindOptionsWhere<User>): Promise<User> {
    return this.userRepository.findOne({ where });
  }
}
