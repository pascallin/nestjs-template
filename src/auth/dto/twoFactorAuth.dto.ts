import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TwoFaAuthDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  code: string;
}
