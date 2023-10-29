import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthDataAccessModule } from '../data-access/auth-data-access.module';
import { AuthUtilsModule } from '../utils/auth-utils.module';

@Module({
  imports: [AuthDataAccessModule, AuthUtilsModule],
  controllers: [AuthController],
})
export class AuthModule {}
