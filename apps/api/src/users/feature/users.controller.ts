import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from '../data-access/user.dto';
import { UsersService } from '../data-access/users.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserCreatedResponse } from '../data-access/user-created.response';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserCreatedResponse,
  })
  async register(@Body() newUser: UserDto) {
    const user = await this.usersService.createUser(newUser);
    return { id: user.id };
  }
}
