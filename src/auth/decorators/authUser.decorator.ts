import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthUser } from '../interfaces';
import { JwtAuthGuard } from '../guards/jwt.guard';

export const CtxAuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: Request & {
      user: AuthUser;
    } = context.switchToHttp().getRequest();

    return req.user;
  },
);

export const UseAuth = () => {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth('jwt'));
};
