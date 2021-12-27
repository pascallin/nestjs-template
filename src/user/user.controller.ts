import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser, CtxAuthUser, UserJWTAuth } from '../auth';
import { UserService } from './user.service';
import { AppOkResponse } from '../app';
import { User } from './user.dto';

@Controller('user')
@ApiTags('user')
@UserJWTAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @AppOkResponse({ model: User })
  @Get('profile')
  getProfile(@CtxAuthUser() user: AuthUser) {
    return user;
  }

  @AppOkResponse({ model: User })
  @Get('user/:username')
  async getUser(@Param('username') username: string) {
    return this.userService.findUser(username);
  }
}
