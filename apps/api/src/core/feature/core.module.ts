import { Module } from '@nestjs/common';
import { UniqueValidator } from '../utils/validators/unique-validator';
import { DbModule } from '../../db/feature/db.module';

@Module({
  imports: [DbModule],
  controllers: [],
  providers: [UniqueValidator],
})
export class CoreModule {}
