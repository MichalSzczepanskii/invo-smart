import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersDataAccessModule } from '../data-access/users-data-access.module';

@Module({
  controllers: [UsersController],
  imports: [UsersDataAccessModule],
  providers: [],
})
export class UsersModule {}
