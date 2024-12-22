import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomBadRequestException } from '../exception/custom-exception';

export interface Response<T> {
  statusCode: number;
  message: string;
  metaData: T;
}

@Injectable()
export class FormatResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          throw new CustomBadRequestException('Không có dữ liệu');
        }
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'success',
          metaData: data
        } as Response<T>
      })
    )
  }
}