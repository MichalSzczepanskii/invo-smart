import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthDataAccessModule } from '../data-access/auth-data-access.module';

@Module({
  imports: [AuthDataAccessModule],
  controllers: [AuthController],
})
export class AuthModule {}
