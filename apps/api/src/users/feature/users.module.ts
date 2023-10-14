import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from '../data-access/users.service';
import { PrismaService } from '../../shared/data-access/prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
