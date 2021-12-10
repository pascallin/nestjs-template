import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService, UserService, TwoFacotorAuthService } from './services';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFaStrategy } from './strategies/twoFA.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    TwoFaStrategy,
    AuthService,
    UserService,
    TwoFacotorAuthService,
  ],
})
export class AuthModule {}
