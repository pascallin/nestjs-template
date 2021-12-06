import { Controller, Get, UseGuards, Logger, Request } from '@nestjs/common';
import { AuthUser, JwtAuthGuard, CtxAuthUser } from '../auth';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@Controller('example')
@ApiTags('example')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class ExampleController {
  private readonly logger = new Logger(ExampleController.name);

  @Get('example')
  @ApiOkResponse({ type: 'succeed' })
  async test(
    @CtxAuthUser() user: AuthUser,
    @Request() req: any,
  ): Promise<string> {
    this.logger.log(user);
    this.logger.log(req.requestId);
    return 'succeed';
  }
}
