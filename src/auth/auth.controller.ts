import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService, TwoFacotorAuthService, UserService } from './services';
import { CtxAuthUser, JwtUseAuth } from './decorators/authUser.decorator';
import { AuthUser } from './interfaces';
import { TwoFaAuthDto, TwoFactorAuthSignInReq, AuthLoginReq } from './dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly twoFacotorAuthService: TwoFacotorAuthService,
  ) {}

  @Post('login')
  async login(@Body() body: AuthLoginReq) {
    return this.authService.login(body);
  }

  @JwtUseAuth()
  @Get('profile')
  getProfile(@CtxAuthUser() user: AuthUser) {
    return user;
  }

  @JwtUseAuth()
  @Get('user/:username')
  async getUser(@Param('username') username: string) {
    return this.userService.findUser(username);
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
