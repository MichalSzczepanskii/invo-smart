import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserDto } from '../data-access/user.dto';
import { UsersService } from '../data-access/users.service';
import { User } from '@invo-smart/shared/data-access';
import { PrismaService } from '../../shared/data-access/prisma/prisma.service';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add new user', async () => {
    const newUser: UserDto = {
      email: 'john.doe@gmail.com',
      name: 'john doe',
      password: 'test123',
    };
    const user: User = {
      ...newUser,
      id: 1,
      password: 'test',
      encryptionKey: 'test',
      emailVerifiedAt: null,
    };
    jest.spyOn(userService, 'createUser').mockResolvedValue(user);

    expect(await controller.register(newUser)).toEqual({ id: user.id });
    expect(userService.createUser).toHaveBeenCalledWith(newUser);
  });
});
