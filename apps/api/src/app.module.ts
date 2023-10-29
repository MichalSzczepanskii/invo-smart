import { Module } from '@nestjs/common';

import { UsersModule } from './users/feature/users.module';
import { CoreModule } from './core/feature/core.module';
import { AuthModule } from './auth/feature/auth.module';
import { DbModule } from './db/feature/db.module';

@Module({
  imports: [CoreModule, DbModule, UsersModule, AuthModule],
  controllers: [],
})
export class AppModule {}
