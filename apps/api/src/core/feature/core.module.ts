import { Module } from '@nestjs/common';
import { UniqueValidator } from '../utils/validators/unique-validator';
import { DbDataAccessModule } from '../../db/data-access/db-data-access.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DbDataAccessModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [UniqueValidator],
})
export class CoreModule {}
