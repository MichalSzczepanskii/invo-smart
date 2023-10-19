import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from '../data-access/user.dto';
import { UsersService } from '../data-access/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async register(@Body() newUser: UserDto) {
    const user = await this.usersService.createUser(newUser);
    return { id: user.id };
  }
}
