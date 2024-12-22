import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomBadRequestException } from '../exception/custom-exception';

@Injectable()
export class FilesProccedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!request.files || request.files.length === 0) {
      throw new CustomBadRequestException('Không có files được gửi lên');
    }
    return next.handle();
  }
}