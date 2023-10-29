import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  oAuth2Client: Auth.OAuth2Client;

  constructor(private configService: ConfigService) {
    this.oAuth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_API_CLIENT_ID'),
      this.configService.get('GOOGLE_API_CLIENT_SECRET'),
      this.configService.get('GOOGLE_API_REDIRECT_URI'),
    );
  }

  generateAuthUrl() {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      prompt: 'select_account',
    });
  }
}
