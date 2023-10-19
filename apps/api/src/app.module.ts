import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/feature/users.module';
import { CoreModule } from './core/feature/core.module';

@Module({
  imports: [CoreModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
