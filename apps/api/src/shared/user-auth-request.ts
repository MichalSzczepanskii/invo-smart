import { Request } from 'express';

export interface UserAuthRequest extends Request {
  user: { id: number; email: string; username: string; iat: number; exp: number };
}
