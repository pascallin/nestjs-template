import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception['message'];
    let code = 'UNDEFINED';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }
    if (exception instanceof ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.constraints;
      code = 'VALIDATION_ERROR';
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
