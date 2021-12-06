import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.debug('inside response interceptor');
    return next.handle().pipe(
      map((data: any) => ({
        message: 'succeed',
        code: HttpStatus.OK, // NOTE: using status code as succeed code
        data,
      })),
    );
  }
}
