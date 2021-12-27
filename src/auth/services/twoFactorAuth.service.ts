import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthUser } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { AuthService } from './auth.service';
import { toFileStream } from 'qrcode';
import { authenticator } from 'otplib';

@Injectable()
export class TwoFacotorAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  async signIn(username: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    user?: AuthUser;
  }> {
    const user = await this.userService.findUser(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.authService.getAccessToken(user);

    if (user.isTwoFactorEnable) {
      return {
        accessToken,
      };
    }

    return {
      accessToken,
    };
  }

  public async qrCodeStreamPipe(stream: Response, otpPathUrl: string) {
    return toFileStream(stream, otpPathUrl);
  }

  public async generateTwoFactorAuthSecret(username: string): Promise<{
    secret;
    otpAuthUrl;
  }> {
    const auth = this.userService.findUser(username);
    if (!auth) {
      throw new NotFoundException('Count not found user');
    }
    if (auth.isTwoFactorEnable) {
      throw new ConflictException(
        'Not allow two factor code auth for this user',
      );
    }
    // if (auth && auth.twoFactorAuthSecret) {
    //   throw new ConflictException('Already QR generated');
    // }

    const app_name = this.configService.get<string>(
      'TWO_FACTOR_AUTHENTICATION_APP_NAME',
    );
    if (auth && auth.twoFactorAuthSecret) {
      const otpAuthUrl = authenticator.keyuri(
        username,
        app_name,
        auth.twoFactorAuthSecret,
      );
      return {
        secret: auth.twoFactorAuthSecret,
        otpAuthUrl,
      };
    } else {
      const secret = authenticator.generateSecret();
      const otpAuthUrl = authenticator.keyuri(username, app_name, secret);

      await this.userService.update(username, { twoFactorAuthSecret: secret });

      return {
        secret,
        otpAuthUrl,
      };
    }
  }

  public async verifyTwoFaCode(code: string, username: string) {
    const auth = this.userService.findUser(username);
    return authenticator.verify({
      token: code,
      secret: auth.twoFactorAuthSecret,
    });
  }
}
