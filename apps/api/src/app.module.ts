import { Module } from '@nestjs/common';

import { UsersModule } from './users/feature/users.module';
import { CoreModule } from './core/feature/core.module';
import { AuthModule } from './auth/feature/auth.module';
import { DbModule } from './db/feature/db.module';
import { GoogleCalendarModule } from './google-calendar/feature/google-calendar.module';
import { GoogleCalendarDataAccessModule } from './google-calendar/data-access/google-calendar-data-access.module';

@Module({
  imports: [
    CoreModule,
    DbModule,
    UsersModule,
    AuthModule,
    GoogleCalendarModule,
    GoogleCalendarDataAccessModule,
  ],
  controllers: [],
})
export class AppModule {}
