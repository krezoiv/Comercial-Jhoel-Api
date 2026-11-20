import { WritableSignal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CuadreAgentesSummary, LatestCashCountResponse } from '../../../core/models';
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
import { parseQuantity } from './components/custody-count-modal/custody-count-modal.component';

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
    state.reset();
  });

  /** Caja edit as the modal emits it (whole quantity ≥ 0). */
  const typeCash = (denomination: 200 | 100 | 50 | 20 | 10 | 5 | 1 | 0.5 | 0.25 | 0.1 | 0.05 | 0.01, value: string) =>
    component.onCashQuantity({ denomination, quantity: parseQuantity(value) });

  it('loads every quantity of the latest arqueo (incl. 100 × Q0.01) and recalculates the total', async () => {
    await component.loadLatestCount();
    expect(confirm.confirm).not.toHaveBeenCalled();
    expect(state.cashCounts()[0.01]).toBe(100);
    expect(component.totalCash()).toBe(4882.5);
    expect(state.origin().loadedCount?.id).toBe('count-1');
  });

  it('asks before replacing hand-typed quantities and keeps them on "Cancelar"', async () => {
    typeCash(200, '3');
    confirm.confirm.and.resolveTo(false);
    await component.loadLatestCount();
    expect(confirm.confirm.calls.mostRecent().args[0].message).toBe(REPLACE_WITH_COUNT_MESSAGE);
    expect(confirm.confirm.calls.mostRecent().args[0].confirmText).toBe('Reemplazar con último arqueo');
    expect(custody.getLatestCount).not.toHaveBeenCalled();
    expect(state.cashCounts()[200]).toBe(3);
  });

  it('replaces them after confirming', async () => {
    typeCash(200, '3');
    confirm.confirm.and.resolveTo(true);
    await component.loadLatestCount();
    expect(state.cashCounts()[200]).toBe(10);
  });

  it('marks the breakdown as modified when edited after loading and sends the breakdown used', async () => {
    await component.loadLatestCount();
    typeCash(0.01, '150');
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
    typeCash(1, '2.7');
    typeCash(5, '-4');
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

  describe('Arqueo de Caja: Caja y Bodega', () => {
    const summary = {
      banks: [],
      totalBanks: 2000,
      totalPositiveAccounts: 2000,
      totalCreditLines: 0,
      totalAssets: 100,
      totalAccountsReceivable: 300,
      totalWarehouseCash: 3000,
      theoreticalCash: 5000,
      totalSchoolListPending: 0,
    } as CuadreAgentesSummary;

    beforeEach(() => {
      cuadre.getSummary.and.returnValue(of(summary));
      component.summary.set(summary);
    });

    it('keeps two independent counts: the caja count never changes Bodega and vice versa', () => {
      typeCash(200, '24');
      typeCash(100, '1');
      component.onWarehouseQuantity({ denomination: 200, quantity: 15 });
      component.onWarehouseQuantity({ denomination: 100, quantity: 1 });
      expect(component.totalCash()).toBe(4900);
      expect(component.totalWarehouse()).toBe(3100);
      component.clearWarehouseCount();
      expect(component.totalWarehouse()).toBe(0);
      expect(component.totalCash()).toBe(4900);
      component.onWarehouseQuantity({ denomination: 50, quantity: 2 });
      component.clearCount();
      expect(component.totalCash()).toBe(0);
      expect(component.totalWarehouse()).toBe(100);
    });

    it('shows each individual difference and the consolidated one (a caja shortage is never hidden)', () => {
      typeCash(200, '24');
      typeCash(100, '1');
      component.onWarehouseQuantity({ denomination: 200, quantity: 15 });
      component.onWarehouseQuantity({ denomination: 100, quantity: 1 });
      expect(component.cashDiff()).toBe(-100);
      expect(component.warehouseDiff()).toBe(100);
      expect(component.consolidatedDiff()).toBe(0);
    });

    it('the result uses the COUNTED Bodega, not its registered balance', () => {
      typeCash(200, '25');
      component.onWarehouseQuantity({ denomination: 200, quantity: 14 });
      // 5000 caja + 2800 Bodega contada + 2000 bancos + 300 CxC − 100 activos.
      expect(component.resultCuadre()).toBe(10000);
    });

    it('"Guardar Cuadre" stays disabled until the arqueo is confirmed', () => {
      component.bankBalancesValidation.set({ date: '2026-11-11', canReconcile: true, totalActiveBanks: 1, banksWithBalance: 1, missingBanks: [] });
      component.isValidatingBankBalances.set(false);
      (TestBed.inject(DayStatusService).status as unknown as WritableSignal<unknown>).set({ isOpened: true, isClosed: false });
      expect(component.canSaveCuadre()).toBeFalse();
      component.openArqueo();
      expect(component.isArqueoOpen()).toBeTrue();
      component.confirmArqueo();
      expect(component.isArqueoOpen()).toBeFalse();
      expect(component.canSaveCuadre()).toBeTrue();
    });

    it('"Cancelar" restores the counts that existed before opening the arqueo', () => {
      typeCash(200, '1');
      component.openArqueo();
      typeCash(200, '9');
      component.onWarehouseQuantity({ denomination: 100, quantity: 4 });
      component.setArqueoObservations('borrador');
      component.cancelArqueo();
      expect(state.cashCounts()[200]).toBe(1);
      expect(component.totalWarehouse()).toBe(0);
      expect(component.arqueoObservations()).toBe('');
      expect(component.arqueoConfirmed()).toBeFalse();
    });

    it('sends every denomination of both counts, separately, with the observations', () => {
      typeCash(200, '24');
      component.onWarehouseQuantity({ denomination: 200, quantity: 15 });
      component.onWarehouseQuantity({ denomination: 0.01, quantity: 3 });
      component.setArqueoObservations('  Cierre del día  ');
      const input = component.buildReconciliationInput();
      expect(input.cashDetails?.length).toBe(12);
      expect(input.warehouseDetails?.length).toBe(12);
      expect(input.cashDetails?.find((d) => d.denomination === 200)?.quantity).toBe(24);
      expect(input.warehouseDetails?.find((d) => d.denomination === 200)?.quantity).toBe(15);
      expect(input.warehouseDetails?.find((d) => d.denomination === 0.01)?.quantity).toBe(3);
      expect(input.cashDetails?.find((d) => d.denomination === 0.01)?.quantity).toBe(0);
      expect(input.observations).toBe('Cierre del día');
    });

    it('after saving, the arqueo starts empty again', () => {
      typeCash(200, '1');
      component.onWarehouseQuantity({ denomination: 200, quantity: 1 });
      component.confirmArqueo();
      state.reset();
      expect(component.totalCash()).toBe(0);
      expect(component.totalWarehouse()).toBe(0);
      expect(component.arqueoConfirmed()).toBeFalse();
    });
  });
});
