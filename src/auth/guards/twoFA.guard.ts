import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TWO_FACTOR_AUTH_STRATAGE_NAME } from '../constants';

@Injectable()
export class TwoFactorGuard extends AuthGuard(TWO_FACTOR_AUTH_STRATAGE_NAME) {}
