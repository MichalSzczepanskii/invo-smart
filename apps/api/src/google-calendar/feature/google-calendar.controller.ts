import { Controller, Get } from '@nestjs/common';
import { GoogleCalendarService } from '../data-access/google-calendar.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUrlResponse } from './responses/auth-url.response';

@ApiBearerAuth()
@ApiTags('google-calendar')
@Controller('google-calendar')
export class GoogleCalendarController {
  constructor(private service: GoogleCalendarService) {}

  @ApiOkResponse({
    type: AuthUrlResponse,
  })
  @Get('authorize')
  generateAuthUrl() {
    return { url: this.service.generateAuthUrl() };
  }
}
