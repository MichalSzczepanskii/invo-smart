import { Module } from '@nestjs/common';
import { AuthDataAccessModule } from '../data-access/auth-data-access.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [AuthDataAccessModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthUtilsModule {}
