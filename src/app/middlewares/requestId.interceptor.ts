import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { AppRequest } from '../interface';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: AppRequest = context.switchToHttp().getRequest();

    if (!this.configService.get<boolean>('ENABLE_REQUEST_ID')) {
      return next.handle();
    }

    const name = this.configService.get<string>('REQUEST_ID_HEADER');
    // setting request id
    if (!req.headers[name]) {
      req.headers[name] = nanoid();
    }

    req.requestId = req.headers[name] as string;
    // setting context tracing log with request Id
    req.tracingLog = new Logger(`TracingLog-${req.requestId}`);

    return next.handle();
  }
}
