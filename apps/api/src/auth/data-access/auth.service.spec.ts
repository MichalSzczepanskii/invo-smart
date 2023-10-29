import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '@invo-smart/shared/data-access';
import { UsersService } from '../../users/data-access/users.service';
import * as bcrypt from 'bcrypt';
import { UsersDataAccessModule } from '../../users/data-access/users-data-access.module';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import process from 'process';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersDataAccessModule,
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' },
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#signIn', () => {
    const email = 'test@gmail.com';
    const password = 'secret';
    const mockUser: User = {
      id: 1,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      name: '',
      encryptionKey: '',
      emailVerifiedAt: undefined,
    };

    it('should throw exception if invalid password is passed', () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      expect(service.signIn(email, 'notValidPassword')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw exception if no user with given email is found', () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      expect(service.signIn('imnotexists@gmail.com', 'notValidPassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return jwt token if valid credentials are passed', async () => {
      const mockedToken = 'mockedToken';
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockedToken);
      const jwtToken = await service.signIn(email, password);
      expect(jwtToken).toEqual({ accessToken: mockedToken });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: mockUser.id,
        username: mockUser.name,
        email: mockUser.email,
      });
    });
  });
});
