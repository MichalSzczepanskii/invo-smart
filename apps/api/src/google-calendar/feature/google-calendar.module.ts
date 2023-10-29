import { Module } from '@nestjs/common';
import { GoogleCalendarController } from './google-calendar.controller';
import { GoogleCalendarDataAccessModule } from '../data-access/google-calendar-data-access.module';

@Module({
  imports: [GoogleCalendarDataAccessModule],
  controllers: [GoogleCalendarController],
})
export class GoogleCalendarModule {}
