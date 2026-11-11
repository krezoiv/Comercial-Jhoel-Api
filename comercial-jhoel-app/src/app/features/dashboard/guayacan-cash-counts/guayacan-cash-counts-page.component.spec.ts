import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { GuayacanCashCount, GuayacanCashCountSummary } from '../../../core/models';
import { GuayacanCashBoxService } from '../../../core/services/guayacan-cash-box.service';
import { GuayacanCashCountsPageComponent } from './guayacan-cash-counts-page.component';

function count(sequence: number, difference: number): GuayacanCashCountSummary {
  return {
    id: `count-${sequence}`,
    sequence,
    number: `ARQ-${String(sequence).padStart(4, '0')}`,
    status: difference === 0 ? 'CUADRADO' : difference > 0 ? 'SOBRANTE' : 'FALTANTE',
    lastMovementId: null,
    lastMovementSequence: null,
    businessDate: '2026-11-02',
    totalCounted: 2500 + difference,
    systemBalance: 2500,
    difference,
    notes: null,
    createdBy: 'user-1',
    createdByUsername: 'erick',
    createdAt: '2026-11-02T20:00:00Z',
  };
}

describe('GuayacanCashCountsPageComponent (Cajas y Cierres → Arqueos — Guayacán)', () => {
  let service: jasmine.SpyObj<GuayacanCashBoxService>;

  function render() {
    const fixture = TestBed.createComponent(GuayacanCashCountsPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    service = jasmine.createSpyObj<GuayacanCashBoxService>('GuayacanCashBoxService', ['getCounts', 'getCountUsers', 'getCount']);
    service.getCounts.and.returnValue(
      of({ items: [count(3, -50), count(2, 25), count(1, 0)], total: 3, page: 1, limit: 20 }),
    );
    service.getCountUsers.and.returnValue(of([{ id: 'user-1', username: 'erick' }]));
    service.getCount.and.returnValue(
      of({ ...count(3, -50), details: [{ denomination: 200, quantity: 12, subtotal: 2400 }] } as GuayacanCashCount),
    );
    TestBed.configureTestingModule({
      imports: [GuayacanCashCountsPageComponent],
      providers: [{ provide: GuayacanCashBoxService, useValue: service }],
    });
  });

  it('lists arqueos newest first with number, user, system, counted and difference', () => {
    const rows = Array.from((render().nativeElement as HTMLElement).querySelectorAll('.counts-table tbody tr'));
    expect(rows.map((row) => row.querySelector('.cell-number')?.textContent?.trim())).toEqual(['ARQ-0003', 'ARQ-0002', 'ARQ-0001']);
    expect(rows[0].textContent).toContain('erick');
    expect(rows[0].querySelector('.cell-system')?.textContent).toContain('Q 2,500.00');
    expect(rows[0].querySelector('.cell-counted')?.textContent).toContain('Q 2,450.00');
  });

  it('colors the difference: red negative, yellow positive, green zero', () => {
    const diffs = Array.from((render().nativeElement as HTMLElement).querySelectorAll('.cell-diff .diff'));
    expect(diffs.map((el) => el.className)).toEqual([
      'diff diff--faltante',
      'diff diff--sobrante',
      'diff diff--cuadrado',
    ]);
    expect(diffs[0].textContent?.trim()).toBe('-Q 50.00');
  });

  it('sends date/user/number filters to the backend from page 1', () => {
    const component = render().componentInstance;
    component.page.set(4);
    component.setDraft('startDate', '2026-11-01');
    component.setDraft('userId', 'user-1');
    component.setDraft('number', 'ARQ-0003');

    component.applyFilters();

    expect(service.getCounts.calls.mostRecent().args[0]).toEqual(
      jasmine.objectContaining({ startDate: '2026-11-01', userId: 'user-1', number: 'ARQ-0003', page: 1 }),
    );
  });

  it('opens the stored detail with all 11 denominations exactly as saved', () => {
    const fixture = render();
    fixture.componentInstance.detailId.set('count-3');
    fixture.detectChanges();

    const rows = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.denominations tbody tr'));
    expect(rows.length).toBe(12);
    expect(rows[0].textContent).toContain('Q200');
    expect(rows[0].textContent).toContain('12');
    expect(rows[0].textContent).toContain('Q 2,400.00');
    expect((fixture.nativeElement as HTMLElement).querySelector('.denominations tfoot')?.textContent).toContain('Q 2,450.00');
  });
});
