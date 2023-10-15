import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../db/data-access/prisma.service';
import { UserDto } from './user.dto';
import { User } from '@invo-smart/shared/data-access';
import { DerivedKey } from '@invo-smart/derived-key';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new user', async () => {
    const derivedKey = 'verySecretToken';
    const encryptionKey = 'test';
    const encryptedDerivedKey = 'verySecretEncryptedToken';
    const hashedPassword = 'hashed';
    const salt = '$2a$10$VRmJ3aQooVdTXfT2BH2nBe';
    const userId = 1;
    const user: UserDto = {
      email: 'john.doe@gmail.com',
      name: 'john doe',
      password: 'secret',
    };

    const userInput: Prisma.UserCreateInput = {
      ...user,
      password: hashedPassword,
      encryptionKey: encryptedDerivedKey,
      emailVerifiedAt: null,
    };
    const userOutput: User = {
      ...userInput,
      id: userId,
      emailVerifiedAt: null as Date,
    };

    jest.spyOn(prismaService.user, 'create').mockResolvedValue(userOutput);
    jest.spyOn(bcrypt, 'genSaltSync').mockReturnValue(salt);
    jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);

    const derivedKeyRandom = new DerivedKey('K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=');
    jest.spyOn(derivedKeyRandom, 'getValue').mockReturnValue(derivedKey);
    jest.spyOn(DerivedKey, 'fromTextRandom').mockReturnValue(derivedKeyRandom);

    const derivedKeyNoRandom = new DerivedKey('K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=');
    jest.spyOn(derivedKeyNoRandom, 'encrypt').mockReturnValue(encryptedDerivedKey);
    jest.spyOn(derivedKeyNoRandom, 'getValue').mockReturnValue(encryptionKey);
    jest.spyOn(DerivedKey, 'fromTextNoRandom').mockReturnValue(derivedKeyNoRandom);

    const createdUser = await service.createUser(user);

    expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(user.password, salt);
    expect(DerivedKey.fromTextRandom).toHaveBeenCalledWith(user.password);
    expect(DerivedKey.fromTextNoRandom).toHaveBeenCalledWith(user.password);
    expect(derivedKeyNoRandom.encrypt).toHaveBeenCalledWith(derivedKey);
    expect(prismaService.user.create).toHaveBeenCalledWith({ data: userInput });
    expect(createdUser).toEqual(userOutput);
  });
});
