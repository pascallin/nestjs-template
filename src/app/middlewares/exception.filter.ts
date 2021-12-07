import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { AppException } from '../exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception['message'];
    let code = 'UNDEFINED';

    // handler different type of Error
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }
    if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.constraints;
      code = 'VALIDATION_ERROR';
    }
    if (exception instanceof AppException) {
      status = exception.httpStatus;
      message = exception.message;
      code = exception.code;
    }
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    response.json({
      statusCode: status,
      message: exception['details'] || message,
      code: exception['code'] || code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
