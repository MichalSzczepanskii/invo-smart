import { IsEmail, IsNotEmpty } from 'class-validator';
import { Unique } from '../../core/utils/validators/unique-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @Unique(['user', 'email'])
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
