import { Test, TestingModule } from '@nestjs/testing';
import { GoogleCalendarService } from './google-calendar.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

jest.mock('googleapis');

describe('GoogleCalendarService', () => {
  let configService: ConfigService;

  const clientId = 'CLIENT_ID';
  const clientSecret = 'CLIENT_SECRET';
  const redirectUri = 'http://localhost:3000';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
      imports: [ConfigModule],
    }).compile();

    configService = module.get(ConfigService);
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
    expect(new GoogleCalendarService(configService)).toBeDefined();
  });

  it('should create oAuth2Client in constructor', () => {
    const calendarService = new GoogleCalendarService(configService);
    expect(google.auth.OAuth2).toHaveBeenCalledWith(clientId, clientSecret, redirectUri);
    expect(calendarService.oAuth2Client).toBeDefined();
  });

  it('should generate authorize url', () => {
    const authorizeUrl = 'http://test.com';
    const calendarService = new GoogleCalendarService(configService);
    jest.spyOn(calendarService.oAuth2Client, 'generateAuthUrl').mockReturnValue(authorizeUrl);
    expect(calendarService.generateAuthUrl()).toEqual(authorizeUrl);
    expect(calendarService.oAuth2Client.generateAuthUrl).toHaveBeenCalledWith({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      prompt: 'select_account',
    });
  });
});
