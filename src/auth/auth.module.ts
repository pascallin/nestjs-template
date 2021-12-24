import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService, UserService, TwoFacotorAuthService } from './services';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFaStrategy } from './strategies/twoFA.strategy';
import { UserModule } from '../user/user.module';

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
    UserModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, TwoFaStrategy, AuthService, TwoFacotorAuthService],
})
export class AuthModule {}
