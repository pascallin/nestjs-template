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
import {
  TWO_FACTOR_AUTH_STRATAGE_NAME,
  JWT_AUTH_STRATAGE_NAME,
} from '../constants';

export const CtxAuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: Request & {
      user: AuthUser;
    } = context.switchToHttp().getRequest();

    return req.user;
  },
);

export const UserJWTAuth = () => {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(JWT_AUTH_STRATAGE_NAME),
  );
};

export const Use2FAAuth = () => {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(TWO_FACTOR_AUTH_STRATAGE_NAME),
  );
};
