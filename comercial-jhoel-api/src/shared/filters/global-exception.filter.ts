import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainError } from '../domain/domain-error';
import { financialDayReviewErrorFromMessage } from '../../modules/financial-day-review/domain/errors/financial-day-review.errors';

interface ErrorBody {
  status: number;
  message: string | string[];
}

/**
 * Registered globally in `app.module.ts` via `APP_FILTER` — `@Catch()` with
 * no argument means every exception thrown anywhere in the app (a
 * `DomainError`, a framework `HttpException` such as `ValidationPipe`'s 400,
 * or a genuine unhandled bug) ends up here, always producing the same flat
 * JSON error shape. This is the error-side counterpart to
 * `ResponseInterceptor`'s success envelope — note the two are deliberately
 * asymmetric: a success body is `{ success, data }`, an error body is
 * `{ success, statusCode, message, timestamp }` with no `data` key at all.
 * Any new client code must branch on this shape difference rather than
 * assuming every response carries `data`.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, message } = this.resolve(exception);

    // Only 5xx is logged as an error — an expected 4xx (bad input, a
    // business-rule rejection) is normal application flow, not an incident,
    // and logging every one of those would drown out genuine failures.
    if (status >= 500) {
      this.logger.error(
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /** `DomainError` is checked first — it is the common case (a use case rejecting on a business rule) and carries its own `status`; anything else falls through to generic HTTP/500 handling. */
  private resolve(exception: unknown): ErrorBody {
    if (exception instanceof DomainError) {
      return { status: exception.status, message: exception.message };
    }

    // A day under historical review rejects normal writes from ANY module
    // (guard trigger `financial_review_day_guard`): surface it as a 409 with its
    // message instead of a generic 500, whichever repository ran the query.
    if (
      exception instanceof Error &&
      exception.message.startsWith('FINANCIAL_REVIEW_')
    ) {
      const mapped = financialDayReviewErrorFromMessage(exception.message);
      if (mapped) {
        return { status: mapped.status, message: mapped.message };
      }
    }

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      const message =
        typeof body === 'string'
          ? body
          : ((body as { message: string | string[] }).message ??
            exception.message);
      return { status: exception.getStatus(), message };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }
}
