import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { AuthUser, UserJWTAuth, CtxAuthUser, Use2FAAuth } from '../auth';
import { AppOkResponse, AppResponse, TracingLog } from '../app';

@Controller('example')
@ApiTags('example')
@AppResponse()
export class ExampleController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Get('example/auth')
  @UserJWTAuth()
  @AppOkResponse({ isNull: true })
  async authTest(
    @CtxAuthUser() user: AuthUser,
    @TracingLog() tracingLog: Logger,
  ): Promise<null> {
    tracingLog.log(user);
    return;
  }

  @Get('example/2fa')
  @Use2FAAuth()
  @AppOkResponse({ isNull: true })
  async TwoFAest(
    @CtxAuthUser() user: AuthUser,
    @TracingLog() tracingLog: Logger,
  ): Promise<null> {
    tracingLog.log(user);
    return;
  }

  @Get('example/processor')
  @AppOkResponse({ isNull: true })
  async testProcessor(@TracingLog() tracingLog: Logger): Promise<null> {
    tracingLog.log('testProcessor');
    this.eventEmitter.emit('example.test');
    return;
  }
}
