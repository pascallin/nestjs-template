import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser, CtxAuthUser, JwtUseAuth } from '../auth';
import { UserService } from './user.service';
import { AppOkResponse } from '../app';
import { User } from './user.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @JwtUseAuth()
  @AppOkResponse({ model: User })
  @Get('profile')
  getProfile(@CtxAuthUser() user: AuthUser) {
    return user;
  }

  @JwtUseAuth()
  @AppOkResponse({ model: User })
  @Get('user/:username')
  async getUser(@Param('username') username: string) {
    return this.userService.findUser(username);
  }
}
