import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';
import { PrismaService } from '../../db/data-access/prisma.service';
import { ServiceEnum } from '@invo-smart/shared/data-access';

@Injectable()
export class GoogleCalendarService {
  oAuth2Client: Auth.OAuth2Client;

  constructor(private configService: ConfigService, private prismaService: PrismaService) {
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

  async getToken(code: string) {
    return this.oAuth2Client.getToken(code);
  }

  async saveToken(token: Auth.Credentials, userId: number) {
    return this.prismaService.oAuth2Token.upsert({
      where: {
        userId: userId,
        serviceId: ServiceEnum.GOOGLE_CALENDAR,
      },
      update: {
        refreshToken: token.refresh_token,
      },
      create: {
        serviceId: ServiceEnum.GOOGLE_CALENDAR,
        userId: userId,
        refreshToken: token.refresh_token,
      },
    });
  }
}