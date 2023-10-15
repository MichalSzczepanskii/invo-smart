import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from '../data-access/users.service';
import { DbModule } from '../../db/feature/db.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DbModule],
})
export class UsersModule {}
