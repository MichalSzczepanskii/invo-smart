import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../db/data-access/prisma.service';
import { UniqueValidator } from './unique-validator';

describe('UniqueValidator', () => {
  let validator: UniqueValidator;
  let prismaService: PrismaService;

  const email = 'john.doe@gmail.com';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniqueValidator, PrismaService],
    }).compile();

    validator = module.get<UniqueValidator>(UniqueValidator);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should return true if email is unique', async () => {
    jest.spyOn(prismaService.user, 'count').mockResolvedValue(0);
    const result = await validator.validate(email, {
      constraints: ['user', 'email'],
      property: 'email',
      value: email,
      object: null,
      targetName: 'UniqueValidator',
    });

    expect(result).toEqual(true);
  });

  it('should return false if email is not unique', async () => {
    jest.spyOn(prismaService.user, 'count').mockResolvedValue(1);
    const result = await validator.validate(email, {
      constraints: ['user', 'email'],
      property: 'email',
      value: email,
      object: null,
      targetName: 'UniqueValidator',
    });

    expect(result).toEqual(false);
  });

  it('should use field property if custom property was not provided', async () => {
    jest.spyOn(prismaService.user, 'count').mockResolvedValue(0);
    const result = await validator.validate(email, {
      constraints: ['user'],
      property: 'email',
      value: email,
      object: null,
      targetName: 'UniqueValidator',
    });

    expect(result).toEqual(true);
    expect(prismaService.user.count).toHaveBeenCalledWith({
      where: {
        email: email,
      },
    });
  });

  it('should use field property if custom property is empty string', async () => {
    jest.spyOn(prismaService.user, 'count').mockResolvedValue(0);
    const result = await validator.validate(email, {
      constraints: ['user', ''],
      property: 'email',
      value: email,
      object: null,
      targetName: 'UniqueValidator',
    });

    expect(result).toEqual(true);
    expect(prismaService.user.count).toHaveBeenCalledWith({
      where: {
        email: email,
      },
    });
  });

  it('should return default message', () => {
    expect(
      validator.defaultMessage({
        constraints: ['user'],
        property: 'email',
        value: email,
        object: null,
        targetName: 'UniqueValidator',
      }),
    ).toEqual('user with the same email already exists');
  });

  it('should return true if email value is not provided', async () => {
    jest.spyOn(prismaService.user, 'count');
    const result = await validator.validate(null, {
      constraints: ['user', ''],
      property: 'email',
      value: null,
      object: null,
      targetName: 'UniqueValidator',
    });
    expect(result).toEqual(true);
    expect(prismaService.user.count).not.toHaveBeenCalled();
  });
});
