import { Controller, Get, Logger } from '@nestjs/common';
import { AuthUser, JwtUseAuth, CtxAuthUser, TowFAUseAuth } from '../auth';
import { ApiTags } from '@nestjs/swagger';
import { AppOkResponse, AppResponse, TracingLog } from '../app';

@Controller('example')
@ApiTags('example')
@AppResponse()
export class ExampleController {
  @Get('example/auth')
  @JwtUseAuth()
  @AppOkResponse({ isNull: true })
  async authTest(
    @CtxAuthUser() user: AuthUser,
    @TracingLog() tracingLog: Logger,
  ): Promise<null> {
    tracingLog.log(user);
    return;
  }

  @Get('example/2fa')
  @TowFAUseAuth()
  @AppOkResponse({ isNull: true })
  async TwoFAest(
    @CtxAuthUser() user: AuthUser,
    @TracingLog() tracingLog: Logger,
  ): Promise<null> {
    tracingLog.log(user);
    return;
  }
}
