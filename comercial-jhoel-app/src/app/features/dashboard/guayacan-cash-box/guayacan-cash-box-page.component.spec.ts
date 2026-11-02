import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { GuayacanCashBoxSummary, GuayacanCashMovement, GuayacanCashMovementDetail } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { GuayacanCashBoxService } from '../../../core/services/guayacan-cash-box.service';
import { GuayacanCashBoxPageComponent } from './guayacan-cash-box-page.component';

function period(transactionCount: number, commissionTotal: number) {
  return {
    startDate: '2026-11-02',
    endDate: '2026-11-08',
    transactionCount,
    operationCount: 1,
    commissionTotal,
    incomeTotal: commissionTotal + 500,
    expenseTotal: 200,
  };
}

const SUMMARY: GuayacanCashBoxSummary = {
  agent: { id: 'agent-1', name: 'Cooperativa', commissionPerTransaction: 3 },
  balance: 5850,
  today: '2026-11-02',
  daily: period(25, 75),
  weekly: period(60, 180),
  monthly: period(200, 600),
};

function movement(id: string, amount: number, overrides: Partial<GuayacanCashMovement> = {}): GuayacanCashMovement {
  return {
    id,
    sequence: 1,
    movementType: amount > 0 ? 'INGRESO' : 'EGRESO',
    amount,
    balanceBefore: 0,
    balanceAfter: amount,
    businessDate: '2026-11-02',
    concept: 'Concepto',
    reason: null,
    notes: null,
    referenceType: null,
    referenceId: null,
    transactionCount: null,
    commissionRate: null,
    reversalOfId: null,
    status: 'VIGENTE',
    voidedAt: null,
    voidedByUsername: null,
    voidReason: null,
    createdBy: 'u',
    createdByUsername: 'erick',
    createdAt: '2026-11-02T20:00:00Z',
    ...overrides,
  };
}

describe('GuayacanCashBoxPageComponent', () => {
  let service: jasmine.SpyObj<GuayacanCashBoxService>;

  function render() {
    const fixture = TestBed.createComponent(GuayacanCashBoxPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    service = jasmine.createSpyObj<GuayacanCashBoxService>('GuayacanCashBoxService', [
      'getSummary',
      'getMovements',
      'getLatestCount',
    ]);
    service.getSummary.and.returnValue(of(SUMMARY));
    service.getMovements.and.returnValue(
      of({
        items: [
          movement('m2', -200, { sequence: 2, concept: 'Retiro de efectivo' }),
          movement('m1', 500, { sequence: 1, status: 'ANULADO' }),
        ],
        total: 2,
        page: 1,
        limit: 15,
      }),
    );
    service.getLatestCount.and.returnValue(of(null));
    TestBed.configureTestingModule({
      imports: [GuayacanCashBoxPageComponent],
      providers: [
        { provide: GuayacanCashBoxService, useValue: service },
        { provide: AuthService, useValue: { isAdmin: signal(false) } },
      ],
    });
  });

  it('shows the Kardex balance and the per-period transactions × commission from the backend', () => {
    const el = render().nativeElement as HTMLElement;
    expect(el.querySelector('.stat--balance .stat__value')?.textContent).toContain('Q 5,850.00');
    const text = el.textContent ?? '';
    expect(text).toContain('25 transacciones');
    expect(text).toContain('Q 75.00');
    expect(text).toContain('Q 180.00');
    expect(text).toContain('Q 600.00');
  });

  it('renders ingresos in green, egresos in red, newest first, and marks voided rows', () => {
    const rows = Array.from((render().nativeElement as HTMLElement).querySelectorAll('.kardex-table tbody tr'));
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('.cell-out')?.textContent?.trim()).toBe('Q 200.00');
    expect(rows[1].querySelector('.cell-in')?.textContent?.trim()).toBe('Q 500.00');
    expect(rows[1].classList).toContain('row--voided');
  });

  it('hides "Ajuste" for a non-admin', () => {
    expect((render().nativeElement as HTMLElement).querySelector('.actions')?.textContent).not.toContain('Ajuste');
  });

  it('applies filters from page 1 and sends them to the backend', () => {
    const component = render().componentInstance;
    component.page.set(3);
    component.draftStartDate.set('2026-11-01');
    component.draftType.set('COMISION_TRANSACCION');

    component.applyFilters();

    expect(component.page()).toBe(1);
    expect(service.getMovements.calls.mostRecent().args[0]).toEqual(
      jasmine.objectContaining({ startDate: '2026-11-01', movementType: 'COMISION_TRANSACCION', page: 1 }),
    );
  });

  it('reloads balance and Kardex from the backend after a save (never computes it locally)', () => {
    const component = render().componentInstance;
    service.getSummary.calls.reset();
    service.getMovements.calls.reset();

    component.onSaved({ movementType: 'INGRESO', balanceAfter: 6350 } as GuayacanCashMovementDetail);

    expect(service.getSummary).toHaveBeenCalledTimes(1);
    expect(service.getMovements).toHaveBeenCalledTimes(1);
  });

  it('warns when no banco agente is marked as Guayacán', () => {
    service.getSummary.and.returnValue(of({ ...SUMMARY, agent: null }));
    expect((render().nativeElement as HTMLElement).querySelector('.notice')?.textContent).toContain('Sistema → Banco Agente');
  });
});
