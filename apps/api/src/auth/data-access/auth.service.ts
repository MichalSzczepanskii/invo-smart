import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/data-access/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}
  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, username: user.name, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
