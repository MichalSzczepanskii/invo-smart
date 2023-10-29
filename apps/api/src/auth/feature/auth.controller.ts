import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from '../data-access/sign-in.dto';
import { AuthService } from '../data-access/auth.service';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedResponse } from './responses/unauthorized.response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiUnauthorizedResponse({ type: UnauthorizedResponse })
  @Post('sign-in')
  async signIn(@Body() credentials: SignInDto) {
    return await this.authService.signIn(credentials.email, credentials.password);
  }
}
