import { AuthGuard } from './auth.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;
  let jwtService: JwtService;
  const mockExecutionContext = createMock<ExecutionContext>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard],
      imports: [JwtModule],
    }).compile();

    guard = module.get(AuthGuard);
    reflector = module.get(Reflector);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if is public key is set', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const result = await guard.canActivate(mockExecutionContext);
    await expect(result).toEqual(true);
  });

  it('should throw unauthorized if no token is passed', () => {
    expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw unauthorized exception if invalid token is passed', () => {
    const httpArgumentHostMock = createMock<HttpArgumentsHost>({
      getRequest: () => ({
        headers: {
          authorization: 'Bearer invalid',
        },
      }),
    });
    mockExecutionContext.switchToHttp.mockImplementation(() => httpArgumentHostMock);
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error();
    });
    expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
  });

  it('should return true if valid bearer token is passed', async () => {
    const token = 'valid';
    const request = {
      user: {},
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const httpArgumentHostMock = createMock<HttpArgumentsHost>({
      getRequest: () => request,
    });
    mockExecutionContext.switchToHttp.mockImplementation(() => httpArgumentHostMock);
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ id: 1 });

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toEqual(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
    expect(request.user).toEqual({ id: 1 });
  });
});
