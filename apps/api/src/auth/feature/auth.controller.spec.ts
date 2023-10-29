import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthDataAccessModule } from '../data-access/auth-data-access.module';
import { AuthService } from '../data-access/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../data-access/sign-in.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthDataAccessModule],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return unauthorized if user with given email does not exits', async () => {
    const credentials: SignInDto = {
      email: 'test@gmail.com',
      password: 'secret',
    };
    jest.spyOn(authService, 'signIn').mockImplementation(() => {
      throw new UnauthorizedException();
    });

    await expect(controller.signIn(credentials)).rejects.toThrow(UnauthorizedException);
  });
});
