import { Module } from '@nestjs/common';
import { DbDataAccessModule } from '../data-access/db-data-access.module';

@Module({
  imports: [DbDataAccessModule],
})
export class DbModule {}
