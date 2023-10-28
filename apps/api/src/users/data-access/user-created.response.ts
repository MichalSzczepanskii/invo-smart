import { ApiProperty } from '@nestjs/swagger';

export class UserCreatedResponse {
  @ApiProperty()
  id: number;
}
