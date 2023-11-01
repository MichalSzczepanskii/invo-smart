import { Entity } from './entity.model';
import { ServiceEnum } from './enums/service.enum';

export interface OAuth2TokenModel extends Entity {
  refreshToken: string;
  userId: number;
  serviceId: ServiceEnum;
}
