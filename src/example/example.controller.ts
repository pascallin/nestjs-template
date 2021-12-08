import { Controller, Get, Logger } from '@nestjs/common';
import { AuthUser, UseAuth, CtxAuthUser } from '../auth';
import { ApiTags } from '@nestjs/swagger';
import { AppOkResponse, AppResponse, TracingLog } from '../app';

@Controller('example')
@ApiTags('example')
@UseAuth()
@AppResponse()
export class ExampleController {
  @Get('example')
  @AppOkResponse({ isNull: true })
  async test(
    @CtxAuthUser() user: AuthUser,
    @TracingLog() tracingLog: Logger,
  ): Promise<null> {
    tracingLog.log(user);
    return;
  }
}
