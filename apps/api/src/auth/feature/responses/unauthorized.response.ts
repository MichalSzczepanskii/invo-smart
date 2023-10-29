import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: string;
}
