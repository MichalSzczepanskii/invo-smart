import { Module } from '@nestjs/common';

import { UsersModule } from './users/feature/users.module';
import { CoreModule } from './core/feature/core.module';

@Module({
  imports: [CoreModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
