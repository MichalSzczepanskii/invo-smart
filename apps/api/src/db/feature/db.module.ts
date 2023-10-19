import { Module } from '@nestjs/common';
import { PrismaService } from '../data-access/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DbModule {}
