import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { DbDataAccessModule } from '../../db/data-access/db-data-access.module';

@Module({
  imports: [DbDataAccessModule],
  providers: [GoogleCalendarService],
  exports: [GoogleCalendarService],
})
export class GoogleCalendarDataAccessModule {}
