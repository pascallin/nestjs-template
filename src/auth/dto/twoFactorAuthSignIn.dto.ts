import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class TwoFactorAuthSignInReq {
  @ApiProperty({ minimum: 4, maximum: 20 })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}
