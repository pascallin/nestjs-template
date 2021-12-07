import { ApiProperty } from '@nestjs/swagger';

export class AppResponseDto<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  code: number;

  data?: T;
}

export class AppExceptionResponseDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  path: string;
}
