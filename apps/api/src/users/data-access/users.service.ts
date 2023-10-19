import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/data-access/prisma.service';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { DerivedKey } from '@invo-smart/derived-key';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  createUser(userData: UserDto) {
    const hashedPassword = bcrypt.hashSync(userData.password, bcrypt.genSaltSync(10));
    const derivedKey = DerivedKey.fromTextRandom(userData.password).getValue();
    const encryptedDerivedKey = DerivedKey.fromTextNoRandom(userData.password).encrypt(
      derivedKey,
    );
    const user: Prisma.UserCreateInput = {
      ...userData,
      password: hashedPassword,
      encryptionKey: encryptedDerivedKey,
      emailVerifiedAt: null,
    };

    return this.prismaService.user.create({ data: user });
  }
}
