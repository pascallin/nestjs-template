import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  private readonly logger = new Logger(RequestIdInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request & {
      requestId: string;
    } = context.switchToHttp().getRequest();

    if (!this.configService.get<boolean>('ENABLE_REQUEST_ID')) {
      return next.handle();
    }

    const name = this.configService.get<string>('REQUEST_ID_HEADER');
    // setting request id
    if (!req.headers[name]) {
      req.headers[name] = nanoid();
    }

    req.requestId = req.headers[name] as string;

    return next.handle();
  }
}
