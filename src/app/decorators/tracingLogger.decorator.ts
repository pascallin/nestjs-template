import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppRequest } from '../interface';

export const TracingLog = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: AppRequest = context.switchToHttp().getRequest();

    return req.tracingLog;
  },
);
