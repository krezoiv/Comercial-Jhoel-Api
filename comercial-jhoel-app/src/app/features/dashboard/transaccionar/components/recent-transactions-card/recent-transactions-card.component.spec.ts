import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CashMovement } from '../../../../../core/models';
import { RecentTransactionsCardComponent } from './recent-transactions-card.component';

function movement(id: string, overrides: Partial<CashMovement> = {}): CashMovement {
  return {
    id,
    sequence: 1,
    operationalDate: '2026-11-10',
    operationalDayId: null,
    cutPeriodId: null,
    cutPeriodNumber: null,
    movementType: 'DEPOSITO',
    originalMovementType: null,
    direction: 'IN',
    amount: 5000,
    previousBalance: 150000,
    newBalance: 155000,
    referenceType: 'BANK_DEPOSIT',
    referenceId: 'op-1',
    description: 'Depósito — 1 trans.',
    bankName: 'GTC Monetaria',
    reason: null,
    reversalOfId: null,
    status: 'VIGENTE',
    voidedAt: null,
    voidedByUsername: null,
    voidReason: null,
    createdBy: 'user-1',
    createdByUsername: 'erick',
    // 10/11/2026 14:15 UTC = 08:15 in Guatemala (UTC−6, no DST).
    createdAt: '2026-11-10T14:15:00.000Z',
    ...overrides,
  };
}

describe('RecentTransactionsCardComponent (efectivo disponible)', () => {
  let fixture: ComponentFixture<RecentTransactionsCardComponent>;

  function render(inputs: { movements?: CashMovement[]; loading?: boolean; failed?: boolean; currentBalance?: number | null }): HTMLElement {
    fixture.componentRef.setInput('movements', inputs.movements ?? []);
    fixture.componentRef.setInput('loading', inputs.loading ?? false);
    fixture.componentRef.setInput('failed', inputs.failed ?? false);
    fixture.componentRef.setInput('currentBalance', inputs.currentBalance ?? null);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function rows(el: HTMLElement): HTMLTableRowElement[] {
    return Array.from(el.querySelectorAll('tbody tr'));
  }

  function text(row: Element, selector: string): string {
    return row.querySelector(selector)?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [RecentTransactionsCardComponent],
      providers: [provideRouter([])],
    }).createComponent(RecentTransactionsCardComponent);
  });

  it('keeps the existing card title and shows the official current balance in the header', () => {
    const el = render({ currentBalance: 159000 });
    expect(text(el, '.recent-card__title')).toBe('Últimas transacciones');
    expect(text(el, '.recent-card__balance strong')).toBe('Q 159,000.00');
  });

  it('shows loading, error (with retry) and empty states', () => {
    expect(render({ loading: true }).querySelector('.recent-card__skeleton')).not.toBeNull();

    const failed = render({ failed: true });
    let retried = 0;
    fixture.componentInstance.retry.subscribe(() => retried++);
    (failed.querySelector('.recent-card__retry') as HTMLButtonElement).click();
    expect(retried).toBe(1);

    expect(render({}).textContent).toContain('Aún no hay movimientos de efectivo registrados.');
  });

  it('lists every kind of cash movement in backend order with the "Efectivo disponible" column last', () => {
    const el = render({
      movements: [
        movement('m7', { movementType: 'RETIRO_BANCARIO', amount: 2000, newBalance: 159000, bankName: 'Banco Industrial' }),
        movement('m6', { movementType: 'ACTIVO', amount: 1500, newBalance: 157000, bankName: null }),
        movement('m5', { movementType: 'GASTO_POR_COBRAR', direction: 'OUT', amount: 500, newBalance: 155500, bankName: null }),
        movement('m4', { movementType: 'PAGO_GENESIS', amount: 3000, newBalance: 156000 }),
        movement('m3', { movementType: 'DESEMBOLSO_GENESIS', direction: 'OUT', amount: 2000, newBalance: 153000 }),
        movement('m2', { movementType: 'DEPOSITO', amount: 5000, newBalance: 155000 }),
      ],
    });

    const headers = Array.from(el.querySelectorAll('thead th')).map((th) => th.textContent?.trim());
    expect(headers[headers.length - 1]).toBe('Efectivo disponible');
    expect(rows(el).map((row) => text(row, '.recent-table__type > span'))).toEqual([
      'Retiro bancario hacia caja',
      'Activo',
      'Gasto por cobrar',
      'Pago préstamo Génesis',
      'Desembolso / renovación Génesis',
      'Depósito',
    ]);
    // The balance column is the backend's newBalance, never recomputed.
    expect(rows(el).map((row) => text(row, '.recent-table__balance'))).toEqual([
      'Q 159,000.00',
      'Q 157,000.00',
      'Q 155,500.00',
      'Q 156,000.00',
      'Q 153,000.00',
      'Q 155,000.00',
    ]);
  });

  it('colours inflows green, outflows red and no-effect rows grey', () => {
    const [inRow, outRow, noneRow] = rows(
      render({
        movements: [
          movement('a'),
          movement('b', { movementType: 'RETIRO', direction: 'OUT', amount: 1000 }),
          movement('c', { movementType: 'REINTEGRO', direction: 'NONE', amount: 700, newBalance: 155000 }),
        ],
      }),
    );
    expect(inRow.querySelector('.recent-table__value--in')?.textContent?.trim()).toBe('+Q 5,000.00');
    expect(text(inRow, '.recent-table__flow')).toBe('Entrada');
    expect(outRow.querySelector('.recent-table__value--out')?.textContent?.trim()).toBe('−Q 1,000.00');
    expect(text(outRow, '.recent-table__flow')).toBe('Salida');
    expect(noneRow.classList).toContain('recent-table__row--none');
    expect(text(noneRow, '.recent-table__flow')).toBe('Sin efecto');
    expect(text(noneRow, '.recent-table__balance')).toBe('Q 155,000.00');
  });

  it('formats date/time in America/Guatemala and shows the related bank', () => {
    const row = rows(render({ movements: [movement('a')] }))[0];
    expect(text(row, '.recent-table__date')).toContain('10/11');
    expect(text(row, '.recent-table__date')).toContain('08:15');
    expect(text(row, '.recent-table__bank')).toBe('GTC Monetaria');
  });

  it('marks voided movements and names what a reversal undoes', () => {
    const [voided, reversal] = rows(
      render({
        movements: [
          movement('a', { status: 'ANULADO' }),
          movement('b', { movementType: 'ANULACION', originalMovementType: 'DEPOSITO', direction: 'OUT' }),
        ],
      }),
    );
    expect(voided.classList).toContain('recent-table__row--voided');
    expect(text(voided, '.recent-table__badge')).toBe('Anulada');
    expect(text(reversal, '.recent-table__type > span')).toBe('Anulación · Depósito');
  });
});
