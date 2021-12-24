import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from '..';

import { AuthLoginReq } from '../dto';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(params: AuthLoginReq): Promise<{ access_token: string }> {
    const user = await this.userService.validateUser(
      params.username,
      params.password,
    );
    if (!user) {
      throw new UnauthorizedException('username or password wrong');
    }
    return {
      access_token: this.getAccessToken(user),
    };
  }

  getAccessToken(user: AuthUser): string {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload);
  }
}
