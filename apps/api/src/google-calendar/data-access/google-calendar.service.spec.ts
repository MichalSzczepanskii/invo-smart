import { Test, TestingModule } from '@nestjs/testing';
import { GoogleCalendarService } from './google-calendar.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';
import { DbModule } from '../../db/feature/db.module';
import { PrismaService } from '../../db/data-access/prisma.service';
import { OAuth2TokenModel, ServiceEnum } from '@invo-smart/shared/data-access';

jest.mock('googleapis');

describe('GoogleCalendarService', () => {
  let configService: ConfigService;
  let prismaService: PrismaService;

  const clientId = 'CLIENT_ID';
  const clientSecret = 'CLIENT_SECRET';
  const redirectUri = 'http://localhost:3000';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
      imports: [ConfigModule, DbModule],
    }).compile();

    configService = module.get(ConfigService);
    prismaService = module.get(PrismaService);
  });

  beforeEach(() => {
    jest.spyOn(configService, 'get').mockImplementation(key => {
      if (key === 'GOOGLE_API_CLIENT_ID') return clientId;
      if (key === 'GOOGLE_API_CLIENT_SECRET') return clientSecret;
      if (key === 'GOOGLE_API_REDIRECT_URI') return redirectUri;
      return '';
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(new GoogleCalendarService(configService, prismaService)).toBeDefined();
  });

  it('should create oAuth2Client in constructor', () => {
    const calendarService = new GoogleCalendarService(configService, prismaService);
    expect(google.auth.OAuth2).toHaveBeenCalledWith(clientId, clientSecret, redirectUri);
    expect(calendarService.oAuth2Client).toBeDefined();
  });

  it('should generate authorize url', () => {
    const authorizeUrl = 'http://test.com';
    const calendarService = new GoogleCalendarService(configService, prismaService);
    jest.spyOn(calendarService.oAuth2Client, 'generateAuthUrl').mockReturnValue(authorizeUrl);
    expect(calendarService.generateAuthUrl()).toEqual(authorizeUrl);
    expect(calendarService.oAuth2Client.generateAuthUrl).toHaveBeenCalledWith({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      prompt: 'select_account',
    });
  });

  it('should return tokens with given auth code', async () => {
    const code = 'code';
    const tokenResponse = {
      tokens: {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      },
    };
    const calendarService = new GoogleCalendarService(configService, prismaService);
    jest
      .spyOn(calendarService.oAuth2Client, 'getToken')
      .mockResolvedValue(tokenResponse as unknown as never);
    expect(await calendarService.getToken(code)).toEqual(tokenResponse);
  });

  it('should save token to the database', async () => {
    const calendarService = new GoogleCalendarService(configService, prismaService);
    const credentials: Auth.Credentials = {
      refresh_token: 'test',
    };
    const userId = 1;
    const mockToken: OAuth2TokenModel = {
      id: 1,
      userId,
      refreshToken: credentials.refresh_token,
      serviceId: ServiceEnum.GOOGLE_CALENDAR,
    };
    jest.spyOn(prismaService.oAuth2Token, 'upsert').mockResolvedValue(mockToken);
    const token = await calendarService.saveToken(credentials, userId);
    expect(prismaService.oAuth2Token.upsert).toHaveBeenCalledWith({
      where: {
        userId: userId,
        serviceId: ServiceEnum.GOOGLE_CALENDAR,
      },
      update: {
        refreshToken: credentials.refresh_token,
      },
      create: {
        serviceId: ServiceEnum.GOOGLE_CALENDAR,
        userId: userId,
        refreshToken: credentials.refresh_token,
      },
    });
    expect(token).toEqual(mockToken);
  });
});
