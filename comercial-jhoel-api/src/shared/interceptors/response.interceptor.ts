import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * Registered globally via `APP_INTERCEPTOR` — wraps every successful
 * controller return value as `{ success: true, data }`, regardless of the
 * module. This is why every use case can simply `return` its plain result;
 * the envelope is applied uniformly here rather than by each controller.
 * See `GlobalExceptionFilter` for the (deliberately differently shaped)
 * error side of this contract.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next
      .handle()
      .pipe(map((data) => ({ success: true as const, data })));
  }
}
