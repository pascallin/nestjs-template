import { Controller, Get, Logger, Request } from '@nestjs/common';
import { AuthUser, Auth, CtxAuthUser } from '../auth';
import { ApiTags } from '@nestjs/swagger';
import { AppOkResponse, AppResponse } from '../app';

@Controller('example')
@ApiTags('example')
@Auth()
@AppResponse()
export class ExampleController {
  private readonly logger = new Logger(ExampleController.name);

  @Get('example')
  @AppOkResponse({ isNull: true })
  async test(
    @CtxAuthUser() user: AuthUser,
    @Request() req: any,
  ): Promise<null> {
    this.logger.log(user);
    this.logger.log(req.requestId);
    return;
  }
}
