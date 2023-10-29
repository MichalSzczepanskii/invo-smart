import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersDataAccessModule } from '../../users/data-access/users-data-access.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersDataAccessModule,
    // JwtModule.register({
    //   secret: 'secret',
    //   global: true,
    // }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthDataAccessModule {}
