import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersDataAccessModule } from '../../users/data-access/users-data-access.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersDataAccessModule,
    JwtModule.register({
      secret: 'secret',
      global: true,
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthDataAccessModule {}
