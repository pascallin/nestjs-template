import { Controller, Get, UseGuards, Logger, Request } from '@nestjs/common';
import { AuthUser, JwtAuthGuard, CtxAuthUser } from '../auth';
import { ApiTags, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import {
  AppResponse,
  AppResponseDto,
} from '../decorators/appResponse.decorator';

@Controller('example')
@ApiTags('example')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
@ApiExtraModels(AppResponseDto)
export class ExampleController {
  private readonly logger = new Logger(ExampleController.name);

  @Get('example')
  @AppResponse({ isNull: true })
  async test(
    @CtxAuthUser() user: AuthUser,
    @Request() req: any,
  ): Promise<null> {
    this.logger.log(user);
    this.logger.log(req.requestId);
    return;
  }
}
