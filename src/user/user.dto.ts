import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  isTwoFactorEnable: boolean;
}
