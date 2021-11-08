import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as R from 'ramda';

import { AuthLoginReq, AuthUser } from './interfaces';

@Injectable()
export class AuthService {
  private readonly users = [
    { userId: '1', username: 'username', password: 'password' },
  ];
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = R.find<AuthUser>(R.propEq('username', username))(this.users);
    if (user && user.password === pass) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(params: AuthLoginReq) {
    const user = R.find<AuthUser>(R.propEq('username', params.username))(
      this.users,
    );
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
