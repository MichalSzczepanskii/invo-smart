import { Test, TestingModule } from '@nestjs/testing';
import { GoogleCalendarController } from './google-calendar.controller';
import { GoogleCalendarDataAccessModule } from '../data-access/google-calendar-data-access.module';
import { GoogleCalendarService } from '../data-access/google-calendar.service';
import { CoreModule } from '../../core/feature/core.module';
import { OAuth2TokenModel, ServiceEnum } from '@invo-smart/shared/data-access';
import { UserAuthRequest } from '../../shared/user-auth-request';
import { createMock } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';

describe('GoogleCalendarController', () => {
  let controller: GoogleCalendarController;
  let service: GoogleCalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleCalendarController],
      imports: [CoreModule, GoogleCalendarDataAccessModule],
    }).compile();

    controller = module.get<GoogleCalendarController>(GoogleCalendarController);
    service = module.get(GoogleCalendarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should generate auth url', () => {
    const url = 'http://test.com';
    jest.spyOn(service, 'generateAuthUrl').mockReturnValue(url);
    expect(controller.generateAuthUrl()).toEqual({
      url,
    });
  });

  it('should generate tokens', async () => {
    const userId = 1;
    const tokenResponse = {
      tokens: {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      },
      res: null,
    };
    const mockToken: OAuth2TokenModel = {
      id: 1,
      userId,
      refreshToken: tokenResponse.tokens.refresh_token,
      serviceId: ServiceEnum.GOOGLE_CALENDAR,
    };
    jest.spyOn(service, 'getToken').mockResolvedValue(tokenResponse);
    jest.spyOn(service, 'saveToken').mockResolvedValue(mockToken);
    const mockRequest = createMock<UserAuthRequest>({
      user: {
        id: userId,
      },
    });
    expect(await controller.saveToken('test', mockRequest)).toEqual({ id: mockToken.id });
    expect(service.getToken).toHaveBeenCalledWith('test');
    expect(service.saveToken).toHaveBeenCalledWith(tokenResponse.tokens, userId);
  });

  it('should throw unprocessable request if invalid code', async () => {
    const userId = 1;
    jest.spyOn(service, 'getToken').mockImplementation(() => {
      throw new Error();
    });
    const mockRequest = createMock<UserAuthRequest>({
      user: {
        id: userId,
      },
    });
    await expect(controller.saveToken('test', mockRequest)).rejects.toThrow(
      new BadRequestException('Invalid code'),
    );
  });
});
