import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService, TwoFacotorAuthService } from './services';
import { JwtUseAuth } from './decorators/authUser.decorator';
import { TwoFaAuthDto, TwoFactorAuthSignInReq, AuthLoginReq } from './dto';
import { User } from '../user/user.dto';

@Controller('auth')
@ApiTags('auth')
@ApiExtraModels(User)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFacotorAuthService: TwoFacotorAuthService,
  ) {}

  @Post('login')
  async login(@Body() body: AuthLoginReq) {
    return this.authService.login(body);
  }

  @JwtUseAuth()
  @Post('qrcode')
  async generateQrCode(
    @Body() body: TwoFactorAuthSignInReq,
    @Res() response: Response,
  ) {
    const { otpAuthUrl } =
      await this.twoFacotorAuthService.generateTwoFactorAuthSecret(
        body.username,
      );
    response.setHeader('content-type', 'image/png');
    return this.twoFacotorAuthService.qrCodeStreamPipe(response, otpAuthUrl);
  }

  @Post('authenticate')
  async authenticate(@Body() twoFaAuthDto: TwoFaAuthDto) {
    const isCodeValid = await this.twoFacotorAuthService.verifyTwoFaCode(
      twoFaAuthDto.code,
      twoFaAuthDto.username,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid authentication code');
    }
    return await this.twoFacotorAuthService.signIn(twoFaAuthDto.username);
  }
}
