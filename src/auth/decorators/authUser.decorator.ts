import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../interfaces';

export const CtxAuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: Request & {
      user: AuthUser;
    } = context.switchToHttp().getRequest();

    return req.user;
  },
);
