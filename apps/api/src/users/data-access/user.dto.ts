import { IsEmail, IsNotEmpty } from 'class-validator';
import { Unique } from '../../core/utils/validators/unique-validator';

export class UserDto {
  @Unique(['user', 'email'])
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;
}
