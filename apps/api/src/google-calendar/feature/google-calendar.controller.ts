import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
} from '@nestjs/common';
import { GoogleCalendarService } from '../data-access/google-calendar.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUrlResponse } from './responses/auth-url.response';
import { UserAuthRequest } from '../../shared/user-auth-request';
import { EntityCreatedResponse } from '../../shared/responses/entity-created.response';

@ApiBearerAuth()
@ApiTags('google-calendar')
@Controller('google-calendar')
export class GoogleCalendarController {
  constructor(private service: GoogleCalendarService) {}

  @ApiOkResponse({
    type: AuthUrlResponse,
  })
  @Get('authorize')
  @Redirect()
  generateAuthUrl() {
    return { url: this.service.generateAuthUrl() };
  }

  @ApiCreatedResponse({
    type: EntityCreatedResponse,
  })
  @Post('save-token')
  async saveToken(@Body('code') code: string, @Req() req: UserAuthRequest) {
    try {
      const tokenResponse = await this.service.getToken(code);
      const savedToken = await this.service.saveToken(tokenResponse.tokens, req.user.id);
      return { id: savedToken.id };
    } catch {
      throw new BadRequestException('Invalid code');
    }
  }
}
