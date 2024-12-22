import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from 'src/module/custom_logger/custom_logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = exception.message;
    const error = exception.getResponse()['error'];
    const status = exception.getStatus();

    const logMessage = `${request.method} ${request.url} ${status} - ${error}`;
    this.logger.error(logMessage, exception.stack);

    response.status(status).json({
      message,
      error,
      statusCode: status,
    });
  }
}