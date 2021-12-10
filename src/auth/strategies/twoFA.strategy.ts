import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthUser, JwtPayload } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../services';

@Injectable()
export class TwoFaStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('TWO_FACTOR_JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const { username } = payload;
    const user = await this.userService.findUser(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.isTwoFactorEnable) {
      return user;
    }
    if (payload.isTwoFaAuthenticated) {
      return user;
    }
  }
}
