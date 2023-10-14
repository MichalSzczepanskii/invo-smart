import { Entity } from './entity.model';

export interface User extends Entity {
  email: string;
  name: string;
  password: string;
  encryptionKey: string;
  emailVerifiedAt: Date;
}
