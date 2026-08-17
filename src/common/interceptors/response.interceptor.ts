import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';
import { HTTP_STATUS_MESSAGES } from 'src/utils/http-status-messages';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const statusCode: number = response.statusCode;
        const message: string =
          HTTP_STATUS_MESSAGES[statusCode] ?? 'Unknown Status';
        return {
          statusCode,
          status: true,
          message,
          data: data ?? null,
        };
      }),
    );
  }
}
