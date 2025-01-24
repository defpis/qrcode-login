import { Expose } from 'class-transformer';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(6)
  username: string;

  @IsNotEmpty()
  password: string;
}

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
