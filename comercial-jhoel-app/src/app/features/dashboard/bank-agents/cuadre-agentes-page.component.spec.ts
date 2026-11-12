import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LatestCashCountResponse } from '../../../core/models';
import { CashCustodyService } from '../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { CuadreAgentesService } from '../../../core/services/cuadre-agentes.service';
import { CuadreAgentesStateService } from '../../../core/services/cuadre-agentes-state.service';
import { DayStatusService } from '../../../core/services/day-status.service';
import { BankBalanceDraftStore } from '../../../core/services/bank-balance-draft.store';
import { NotificationService } from '../../../core/services/notification.service';
import {
  CuadreAgentesPageComponent,
  NO_SECOND_CUT_MESSAGE,
  REPLACE_WITH_COUNT_MESSAGE,
} from './cuadre-agentes-page.component';

const ACCEPTANCE: Array<[number, number]> = [
  [200, 10], [100, 20], [50, 10], [20, 10], [10, 10], [5, 10],
  [1, 20], [0.5, 10], [0.25, 20], [0.1, 10], [0.05, 10], [0.01, 100],
];

function latest(isFromReferenceDay = true): LatestCashCountResponse {
  return {
    count: {
      source: 'CORTE_CAJA',
      id: 'count-1',
      number: null,
      cutPeriodId: 'cut-2',
      cutNumber: 2,
      businessDate: isFromReferenceDay ? '2026-11-11' : '2026-11-10',
      countedAt: '2026-11-11T15:30:00.000Z',
      totalCounted: 4882.5,
      createdByUsername: 'supervisor',
    },
    breakdown: ACCEPTANCE.map(([denomination, quantity]) => ({
      denomination,
      quantity,
      subtotal: denomination * quantity,
    })),
    referenceBusinessDate: '2026-11-11',
    isFromReferenceDay,
  };
}

describe('CuadreAgentesPageComponent — Conteo de Efectivo', () => {
  let component: CuadreAgentesPageComponent;
  let state: CuadreAgentesStateService;
  let custody: jasmine.SpyObj<CashCustodyService>;
  let confirm: jasmine.SpyObj<ConfirmDialogService>;
  let notifications: jasmine.SpyObj<NotificationService>;
  let cuadre: jasmine.SpyObj<CuadreAgentesService>;

  beforeEach(() => {
    custody = jasmine.createSpyObj('CashCustodyService', ['getLatestCount']);
    custody.getLatestCount.and.returnValue(of(latest()));
    confirm = jasmine.createSpyObj('ConfirmDialogService', ['confirm']);
    notifications = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);
    cuadre = jasmine.createSpyObj('CuadreAgentesService', ['getSummary', 'validateBankBalances', 'registerReconciliation']);
    cuadre.getSummary.and.returnValue(of(null) as never);
    cuadre.validateBankBalances.and.returnValue(of(null) as never);

    TestBed.configureTestingModule({
      imports: [CuadreAgentesPageComponent],
      providers: [
        { provide: CashCustodyService, useValue: custody },
        { provide: ConfirmDialogService, useValue: confirm },
        { provide: NotificationService, useValue: notifications },
        { provide: CuadreAgentesService, useValue: cuadre },
        { provide: BankBalanceDraftStore, useValue: { operationDate: signal('2026-11-11'), setOperationDate: () => undefined } },
        { provide: DayStatusService, useValue: { status: signal(null), loading: signal(false), refresh: () => undefined } },
      ],
    });
    TestBed.overrideComponent(CuadreAgentesPageComponent, { set: { template: '', imports: [] } });
    component = TestBed.createComponent(CuadreAgentesPageComponent).componentInstance;
    state = TestBed.inject(CuadreAgentesStateService);
    state.clear();
  });

  it('loads every quantity of the latest arqueo (incl. 100 × Q0.01) and recalculates the total', async () => {
    await component.loadLatestCount();
    expect(confirm.confirm).not.toHaveBeenCalled();
    expect(state.cashCounts()[0.01]).toBe(100);
    expect(component.rowTotal(0.01)).toBe(1);
    expect(component.totalCash()).toBe(4882.5);
    expect(state.origin().loadedCount?.id).toBe('count-1');
  });

  it('asks before replacing hand-typed quantities and keeps them on "Cancelar"', async () => {
    component.onQuantityInput(200, '3');
    confirm.confirm.and.resolveTo(false);
    await component.loadLatestCount();
    expect(confirm.confirm.calls.mostRecent().args[0].message).toBe(REPLACE_WITH_COUNT_MESSAGE);
    expect(confirm.confirm.calls.mostRecent().args[0].confirmText).toBe('Reemplazar con último arqueo');
    expect(custody.getLatestCount).not.toHaveBeenCalled();
    expect(state.cashCounts()[200]).toBe(3);
  });

  it('replaces them after confirming', async () => {
    component.onQuantityInput(200, '3');
    confirm.confirm.and.resolveTo(true);
    await component.loadLatestCount();
    expect(state.cashCounts()[200]).toBe(10);
  });

  it('marks the breakdown as modified when edited after loading and sends the breakdown used', async () => {
    await component.loadLatestCount();
    component.onQuantityInput(0.01, '150');
    expect(component.totalCash()).toBe(4883);
    expect(state.origin().modifiedAfterLoad).toBeTrue();
    const input = component.buildReconciliationInput();
    expect(input.totalCash).toBe(4883);
    expect(input.cashBreakdownSource).toBe('CORTE_CAJA');
    expect(input.sourceCashCountId).toBe('count-1');
    expect(input.cashDetails?.length).toBe(12);
    expect(input.cashDetails?.find((d) => d.denomination === 0.01)?.quantity).toBe(150);
  });

  it('warns when the arqueo belongs to an earlier day (never presented as today)', async () => {
    custody.getLatestCount.and.returnValue(of(latest(false)));
    await component.loadLatestCount();
    expect(notifications.warning).toHaveBeenCalled();
    expect(state.origin().loadedCount?.isFromReferenceDay).toBeFalse();
  });

  it('with no arqueos says so and leaves the manual count', async () => {
    custody.getLatestCount.and.returnValue(
      of({ count: null, breakdown: [], referenceBusinessDate: '2026-11-11', isFromReferenceDay: false }),
    );
    await component.loadLatestCount();
    expect(notifications.info).toHaveBeenCalledWith(NO_SECOND_CUT_MESSAGE);
    expect(state.origin().loadedCount).toBeNull();
  });

  it('a manual count sends MANUAL without a source; quantities are whole and never negative', () => {
    component.onQuantityInput(1, '2.7');
    component.onQuantityInput(5, '-4');
    expect(state.cashCounts()[1]).toBe(2);
    expect(state.cashCounts()[5]).toBe(0);
    const input = component.buildReconciliationInput();
    expect(input.cashBreakdownSource).toBe('MANUAL');
    expect(input.sourceCashCountId).toBeUndefined();
    expect(input.totalCash).toBe(2);
  });

  it('"Limpiar" starts a new manual count', async () => {
    await component.loadLatestCount();
    component.clearCount();
    expect(state.origin().loadedCount).toBeNull();
    expect(component.totalCash()).toBe(0);
  });

  it('loads exactly the second cut (final del día) — never the sum of both cuts', async () => {
    const corte2: Array<[number, number]> = [[200, 80], [100, 40], [50, 15], [20, 20], [10, 10]];
    const response = latest();
    response.breakdown = corte2.map(([denomination, quantity]) => ({ denomination, quantity, subtotal: denomination * quantity }));
    response.count!.totalCounted = 21250;
    custody.getLatestCount.and.returnValue(of(response));
    await component.loadLatestCount();
    expect(state.cashCounts()[200]).toBe(80);
    expect(state.cashCounts()[100]).toBe(40);
    expect(state.cashCounts()[50]).toBe(15);
    expect(state.cashCounts()[20]).toBe(20);
    expect(state.cashCounts()[10]).toBe(10);
    expect(state.cashCounts()[0.01]).toBe(0);
    expect(component.totalCash()).toBe(21250);
    expect(state.origin().loadedCount?.cutNumber).toBe(2);
    // Loading twice replaces (does not accumulate).
    await component.loadLatestCount();
    expect(state.cashCounts()[200]).toBe(80);
    expect(component.totalCash()).toBe(21250);
  });
});
