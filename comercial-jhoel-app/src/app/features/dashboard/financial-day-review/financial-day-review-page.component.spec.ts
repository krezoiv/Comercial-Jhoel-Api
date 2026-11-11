import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { FinancialDayDetail, ReviewCorrection } from '../../../core/models';
import { FinancialDayReviewService } from '../../../core/services/financial-day-review.service';
import { FinancialDayReviewPageComponent } from './financial-day-review-page.component';

function detail(
  overrides: Partial<FinancialDayDetail> = {},
): FinancialDayDetail {
  return {
    date: '2020-01-11',
    diagnosis: {
      movements: [],
      differences: [],
    } as unknown as FinancialDayDetail['diagnosis'],
    activeSession: null,
    sessions: [],
    corrections: [],
    permissions: { canReview: true, canCorrect: true, isSessionOwner: false },
    ...overrides,
  };
}

const session = {
  id: 's1',
  reviewDate: '2020-01-11',
  status: 'IN_REVIEW',
} as FinancialDayDetail['activeSession'];

describe('FinancialDayReviewPageComponent (revisión de días operativos)', () => {
  let page: FinancialDayReviewPageComponent;
  let service: FinancialDayReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FinancialDayReviewPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    service = TestBed.inject(FinancialDayReviewService);
    spyOn(service, 'listDays').and.returnValue(of([]));
    page = TestBed.createComponent(
      FinancialDayReviewPageComponent,
    ).componentInstance;
  });

  it('offers "abrir día para revisión" only for past days without an active session and with permission', () => {
    page.detail.set(detail());
    expect(page.canOpenReview()).toBeTrue();
    page.detail.set(detail({ activeSession: session }));
    expect(page.canOpenReview()).toBeFalse();
    page.detail.set(
      detail({
        permissions: {
          canReview: true,
          canCorrect: false,
          isSessionOwner: false,
        },
      }),
    );
    expect(page.canOpenReview()).toBeFalse();
    page.detail.set(detail({ date: page.today }));
    expect(page.canOpenReview()).toBeFalse();
  });

  it('allows corrections only to the owner of the open session', () => {
    page.detail.set(detail({ activeSession: session }));
    expect(page.canEdit()).toBeFalse();
    page.detail.set(
      detail({
        activeSession: session,
        permissions: {
          canReview: true,
          canCorrect: true,
          isSessionOwner: true,
        },
      }),
    );
    expect(page.canEdit()).toBeTrue();
  });

  it('ignores future days', () => {
    spyOn(service, 'getDay');
    page.selectDay('2999-01-01');
    expect(service.getDay).not.toHaveBeenCalled();
    expect(page.selectedDate()).toBeNull();
  });

  it('sends the correction with its request id and blocks a second submit while saving', () => {
    page.detail.set(
      detail({
        activeSession: session,
        permissions: {
          canReview: true,
          canCorrect: true,
          isSessionOwner: true,
        },
      }),
    );
    const correct = spyOn(service, 'correctSnapshot').and.returnValue(
      of({} as ReviewCorrection),
    );
    spyOn(service, 'getDay').and.returnValue(of(detail()));
    page.selectedDate.set('2020-01-11');
    const submission = {
      request: {
        kind: 'SNAPSHOT' as const,
        target: 'BANK_BALANCE' as const,
        targetId: 'bb1',
        field: 'final_balance',
        module: 'BANCOS' as const,
        label: 'Saldo',
        originalValue: 120000,
        allowNegative: true,
      },
      newValue: 125000,
      reason: 'Saldo mal digitado',
      observations: '',
      requestId: 'req-123456',
    };
    page.saving.set(true);
    page.confirmCorrection(submission);
    expect(correct).not.toHaveBeenCalled();
    page.saving.set(false);
    page.confirmCorrection(submission);
    expect(correct).toHaveBeenCalledWith('s1', {
      target: 'BANK_BALANCE',
      targetId: 'bb1',
      field: 'final_balance',
      newValue: 125000,
      reason: 'Saldo mal digitado',
      observations: undefined,
      requestId: 'req-123456',
    });
  });

  it('builds a Monday-first calendar for the selected month', () => {
    page.month.set('2026-09');
    const cells = page.calendar();
    expect(cells.filter((c) => c.date).length).toBe(30);
    expect(cells.findIndex((c) => c.date === '2026-09-01')).toBe(1); // 1 Sep 2026 is a Tuesday
  });
});
