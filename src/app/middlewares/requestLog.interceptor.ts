import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  private readonly logger = new Logger(RequestLogInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();

    if (!this.configService.get<boolean>('ENABLE_REQUEST_LOG')) {
      return next.handle();
    }

    this.logger.log(`request url ${req.url}`);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `request url ${req.url} succeed, After... ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
