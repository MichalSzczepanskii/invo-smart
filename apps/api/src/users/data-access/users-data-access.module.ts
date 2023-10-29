import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DbDataAccessModule } from '../../db/data-access/db-data-access.module';

@Module({
  imports: [DbDataAccessModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersDataAccessModule {}
