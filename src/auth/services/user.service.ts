import { Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { AuthUser } from '../interfaces';

@Injectable()
export class UserService {
  // fake users
  private users = [
    {
      userId: '1',
      username: 'username',
      password: 'password',
      isTwoFactorEnable: false,
    },
    {
      userId: '2',
      username: 'username2',
      password: 'password',
      isTwoFactorEnable: false,
    },
  ];

  findUser(username: string): AuthUser {
    return R.find<AuthUser>(R.propEq('username', username))(this.users);
  }

  update(username: string, data: Partial<AuthUser>): void {
    const index = R.findIndex<AuthUser>(
      (v) => v.username == username,
      this.users,
    );
    const users = this.getUsers();
    const updatedRecord = R.mergeDeepLeft(data, users[index]);
    this.setUsers(R.update(index, updatedRecord, this.users));
  }

  private getUsers(): AuthUser[] {
    return this.users;
  }
  private setUsers(newUsers: AuthUser[]): void {
    this.users = newUsers;
  }

  async validateUser(username: string, pass: string): Promise<AuthUser> {
    const user = this.findUser(username);
    if (user && user.password === pass) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
}
