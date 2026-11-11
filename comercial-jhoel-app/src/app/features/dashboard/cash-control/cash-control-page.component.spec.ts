import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CashBankDaySummary, CashPosition } from '../../../core/models';
import { CashControlService } from '../../../core/services/cash-control.service';
import { CashControlPageComponent } from './cash-control-page.component';

function day(date: string, overrides: Partial<CashBankDaySummary> = {}): CashBankDaySummary {
  return {
    businessDate: date,
    dayOpeningId: 'opening-' + date,
    agentDayStatus: 'CERRADO',
    startSequence: 0,
    endSequence: 2,
    isCurrent: false,
    openedAt: `${date}T13:00:00Z`,
    openedByUsername: 'admin',
    source: 'APERTURA',
    closingBalance: 105000,
    lastMovementAt: null,
    openingBalance: 100000,
    totalIn: 10000,
    totalOut: 5000,
    movementCount: 2,
    buckets: [
      { movementType: 'DEPOSITO', totalIn: 10000, totalOut: 0, count: 1 },
      { movementType: 'RETIRO', totalIn: 0, totalOut: 5000, count: 1 },
    ],
    ...overrides,
  };
}

/** Day 2 right after its bank opening: every daily indicator is zero, the balance is the day-1 close. */
function position(): CashPosition {
  return {
    date: '2026-11-11',
    balance: 105000,
    lastSequence: 2,
    lastMovementAt: null,
    hasInitialBalance: true,
    dayState: 'SIN_APERTURA',
    day: null,
    periods: [],
    openPeriod: null,
    summary: { openingBalance: 105000, totalIn: 0, totalOut: 0, movementCount: 0, buckets: [] },
    warehouseBalance: 20000,
    custodyTotal: 125000,
    bankDay: { ...day('2026-11-11'), isCurrent: true, endSequence: null, agentDayStatus: 'ABIERTO' },
    canCloseDay: false,
  };
}

describe('CashControlPageComponent (acumulados por día operativo bancario)', () => {
  let page: CashControlPageComponent;
  let movementsSpy: jasmine.Spy;
  let bankDaySpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CashControlPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const service = TestBed.inject(CashControlService);
    spyOn(service, 'getUsers').and.returnValue(of([]));
    spyOn(service, 'getPosition').and.returnValue(of(position()));
    spyOn(service, 'getBankDays').and.returnValue(
      of([{ ...day('2026-11-11'), isCurrent: true, endSequence: null, totalIn: 0, totalOut: 0, movementCount: 0, buckets: [] }, day('2026-11-10')]),
    );
    bankDaySpy = spyOn(service, 'getBankDay').and.callFake((date: string) => of(day(date)));
    movementsSpy = spyOn(service, 'getMovements').and.returnValue(
      of({ items: [], total: 0, page: 1, limit: 25, totalIn: 0, totalOut: 0 }),
    );
    page = TestBed.createComponent(CashControlPageComponent).componentInstance;
  });

  it('shows zero daily indicators after the opening while the physical balance keeps its value', () => {
    const viewed = page.viewedDay()!;
    expect(viewed.isPast).toBeFalse();
    expect([viewed.summary.totalIn, viewed.summary.totalOut, viewed.summary.movementCount]).toEqual([0, 0, 0]);
    expect(page.position()!.balance).toBe(105000);
    expect(page.summaryCards().every((card) => card.totalIn === 0 && card.totalOut === 0)).toBeTrue();
  });

  it('the Kardex starts filtered on the current bank day', () => {
    expect(movementsSpy.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ bankDate: '2026-11-11' }));
  });

  it('consulting a past day shows its original values (read only) and its Kardex range', () => {
    page.selectBankDate('2026-11-10');
    expect(bankDaySpy).toHaveBeenCalledWith('2026-11-10');
    const viewed = page.viewedDay()!;
    expect(viewed.isPast).toBeTrue();
    expect([viewed.summary.totalIn, viewed.summary.totalOut, viewed.header!.closingBalance]).toEqual([10000, 5000, 105000]);
    expect(movementsSpy.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ bankDate: '2026-11-10' }));
  });

  it('going back to "Actual" shows the live indicators again', () => {
    page.selectBankDate('2026-11-10');
    page.selectBankDate('');
    expect(page.viewedDay()!.isPast).toBeFalse();
    expect(movementsSpy.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ bankDate: '2026-11-11' }));
  });

  it('a date filter replaces the bank-day filter', () => {
    page.setDraft({ dateFrom: '2026-11-01' });
    expect(page.draft().bankDate).toBeUndefined();
    expect(page.draft().dateFrom).toBe('2026-11-01');
  });
});
