import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ApiSuccessResponse,
  CloseReviewSummary,
  FinancialDayDetail,
  FinancialDayListItem,
  MovementSource,
  ReviewCorrection,
  ReviewSession,
  SnapshotTarget,
} from '../models';

const BASE_URL = `${environment.apiUrl}/financial-day-reviews`;

/** Common fields of every correction: mandatory reason + one idempotency key per attempt. */
export interface CorrectionMeta {
  reason: string;
  observations?: string;
  requestId: string;
}

/**
 * API client of "Revisión de días operativos". Writes only send what the
 * administrator decided (corrected value, reason, request id); the backend
 * validates the day, recalculates and audits.
 */
@Injectable({ providedIn: 'root' })
export class FinancialDayReviewService {
  private readonly http = inject(HttpClient);

  /** Calendar/table rows for an inclusive date range. */
  listDays(from: string, to: string): Observable<FinancialDayListItem[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http
      .get<ApiSuccessResponse<FinancialDayListItem[]>>(`${BASE_URL}/days`, {
        params,
      })
      .pipe(map((r) => r.data));
  }

  /** Full diagnosis of one day + its review sessions and corrections. */
  getDay(date: string): Observable<FinancialDayDetail> {
    return this.http
      .get<ApiSuccessResponse<FinancialDayDetail>>(`${BASE_URL}/days/${date}`)
      .pipe(map((r) => r.data));
  }

  /** Audit trail of one day. */
  listCorrections(date: string): Observable<ReviewCorrection[]> {
    const params = new HttpParams().set('date', date);
    return this.http
      .get<ApiSuccessResponse<ReviewCorrection[]>>(`${BASE_URL}/corrections`, {
        params,
      })
      .pipe(map((r) => r.data));
  }

  /** "ABRIR DÍA PARA REVISIÓN" (creates the audited session; changes no data). */
  openReview(date: string, reason: string): Observable<ReviewSession> {
    return this.http
      .post<ApiSuccessResponse<ReviewSession>>(`${BASE_URL}/sessions`, {
        date,
        reason,
        confirm: true,
      })
      .pipe(map((r) => r.data));
  }

  /** Corrects a snapshot value of the reviewed day (versioned in the backend). */
  correctSnapshot(
    sessionId: string,
    input: {
      target: SnapshotTarget;
      targetId: string;
      field: string;
      newValue: number;
    } & CorrectionMeta,
  ): Observable<ReviewCorrection> {
    return this.http
      .post<ApiSuccessResponse<ReviewCorrection>>(
        `${BASE_URL}/sessions/${sessionId}/snapshot-corrections`,
        {
          ...input,
          confirm: true,
        },
      )
      .pipe(map((r) => r.data));
  }

  /** Corrects a movement amount through a linked adjustment (the original is kept). */
  adjustMovement(
    sessionId: string,
    input: {
      source: MovementSource;
      sourceId: string;
      correctedAmount: number;
    } & CorrectionMeta,
  ): Observable<ReviewCorrection> {
    return this.http
      .post<ApiSuccessResponse<ReviewCorrection>>(
        `${BASE_URL}/sessions/${sessionId}/movement-adjustments`,
        {
          ...input,
          confirm: true,
        },
      )
      .pipe(map((r) => r.data));
  }

  /** Moves the session to "pending confirmation" and returns the close summary. */
  requestClose(sessionId: string): Observable<CloseReviewSummary> {
    return this.http
      .post<ApiSuccessResponse<CloseReviewSummary>>(
        `${BASE_URL}/sessions/${sessionId}/close-request`,
        {},
      )
      .pipe(map((r) => r.data));
  }

  /** Final, explicit close of the review. */
  close(
    sessionId: string,
    input: { observations?: string; acceptPendingDifferences: boolean },
  ): Observable<ReviewSession> {
    return this.http
      .post<ApiSuccessResponse<ReviewSession>>(
        `${BASE_URL}/sessions/${sessionId}/close`,
        { ...input, confirm: true },
      )
      .pipe(map((r) => r.data));
  }
}
