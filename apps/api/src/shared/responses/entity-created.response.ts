import { ApiProperty } from '@nestjs/swagger';

export class EntityCreatedResponse {
  @ApiProperty()
  id: number;
}
