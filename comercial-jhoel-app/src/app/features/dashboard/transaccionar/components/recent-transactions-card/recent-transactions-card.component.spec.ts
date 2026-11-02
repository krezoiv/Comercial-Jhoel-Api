import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDepositOperationSummary } from '../../../../../core/models';
import { RecentTransactionsCardComponent } from './recent-transactions-card.component';

function operation(id: string, overrides: Partial<BankDepositOperationSummary> = {}): BankDepositOperationSummary {
  return {
    id,
    transactionBankId: 'agent-1',
    transactionBankName: 'GTC',
    bankAccountId: 'acc-1',
    bankAccountName: 'GTC Monetaria',
    bankAccountNumber: '3010-22',
    totalAmount: 850,
    transactionCount: 1,
    operationDate: '2026-11-02',
    clientName: null,
    clientId: null,
    transactionTypeId: 'type-1',
    transactionTypeName: 'Depósito',
    userId: 'user-1',
    username: 'erick',
    // 02/11/2026 20:05 UTC = 14:05 en Guatemala (UTC−6, sin horario de verano).
    createdAt: '2026-11-02T20:05:00.000Z',
    isVoided: false,
    voidedAt: null,
    voidedByUsername: null,
    voidReason: null,
    ...overrides,
  };
}

describe('RecentTransactionsCardComponent', () => {
  let fixture: ComponentFixture<RecentTransactionsCardComponent>;

  function render(inputs: { operations?: BankDepositOperationSummary[]; loading?: boolean; failed?: boolean }): HTMLElement {
    fixture.componentRef.setInput('operations', inputs.operations ?? []);
    fixture.componentRef.setInput('loading', inputs.loading ?? false);
    fixture.componentRef.setInput('failed', inputs.failed ?? false);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function rows(el: HTMLElement): HTMLTableRowElement[] {
    return Array.from(el.querySelectorAll('tbody tr'));
  }

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({ imports: [RecentTransactionsCardComponent] }).createComponent(
      RecentTransactionsCardComponent,
    );
  });

  it('is titled "Últimas transacciones"', () => {
    expect(render({}).querySelector('.recent-card__title')?.textContent?.trim()).toBe('Últimas transacciones');
  });

  it('shows a loading state', () => {
    const el = render({ loading: true });
    expect(el.querySelector('.recent-card__skeleton')).not.toBeNull();
    expect(el.querySelector('table')).toBeNull();
  });

  it('shows the empty state when there are no operations', () => {
    expect(render({}).textContent).toContain('Aún no hay transacciones registradas.');
  });

  it('shows the error state with a retry action', () => {
    const el = render({ failed: true });
    let retried = 0;
    fixture.componentInstance.retry.subscribe(() => retried++);

    expect(el.querySelector('[role="alert"]')?.textContent).toContain('No se pudieron cargar');
    (el.querySelector('.recent-card__retry') as HTMLButtonElement).click();
    expect(retried).toBe(1);
  });

  it('renders the rows in the order received from the backend (newest first)', () => {
    const el = render({
      operations: [
        operation('op-3', { transactionTypeName: 'Retiros' }),
        operation('op-2', { transactionTypeName: 'Reintegros' }),
        operation('op-1', { transactionTypeName: 'Depósito' }),
      ],
    });

    expect(rows(el).map((row) => row.querySelector('.recent-table__type span')?.textContent?.trim())).toEqual([
      'Retiros',
      'Reintegros',
      'Depósito',
    ]);
  });

  it('renders fewer than 10 rows as-is', () => {
    expect(rows(render({ operations: [operation('a'), operation('b')] })).length).toBe(2);
  });

  it('formats date/time in America/Guatemala and the amount in quetzales with two decimals', () => {
    const row = rows(render({ operations: [operation('op-1', { totalAmount: 1200 })] }))[0];

    expect(row.querySelector('.recent-table__date')?.textContent).toContain('02/11');
    expect(row.querySelector('.recent-table__date')?.textContent).toContain('14:05');
    expect(row.querySelector('.recent-table__value')?.textContent?.trim()).toBe('Q 1,200.00');
  });

  it('shows the affected account and its number', () => {
    const row = rows(render({ operations: [operation('op-1')] }))[0];
    expect(row.querySelector('.recent-table__account')?.textContent).toContain('GTC Monetaria');
    expect(row.querySelector('.recent-table__account')?.textContent).toContain('3010-22');
  });

  it('falls back to the banco agente when the type moves no account', () => {
    const row = rows(render({ operations: [operation('op-1', { bankAccountName: null, bankAccountNumber: null })] }))[0];
    expect(row.querySelector('.recent-table__account')?.textContent?.trim()).toBe('GTC');
  });

  it('shows the operation total once — never multiplied by its distributed transactions', () => {
    const row = rows(render({ operations: [operation('op-1', { totalAmount: 1500, transactionCount: 3 })] }))[0];
    expect(row.querySelector('.recent-table__value')?.textContent?.trim()).toBe('Q 1,500.00');
    expect(row.querySelector('.recent-table__amount')?.textContent).toContain('3 trans.');
  });

  it('marks a voided operation as "Anulada" instead of showing it as vigente', () => {
    const row = rows(render({ operations: [operation('op-1', { isVoided: true })] }))[0];
    expect(row.classList).toContain('recent-table__row--voided');
    expect(row.querySelector('.recent-table__badge')?.textContent?.trim()).toBe('Anulada');
  });
});
