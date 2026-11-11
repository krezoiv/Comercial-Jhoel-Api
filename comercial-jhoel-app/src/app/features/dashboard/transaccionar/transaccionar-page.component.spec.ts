import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, of, throwError } from 'rxjs';

import { BankDepositOperation, CashMovement, RegisterBankDepositInput } from '../../../core/models';
import { CashControlService } from '../../../core/services/cash-control.service';
import { BankDepositDraftStore } from '../../../core/services/bank-deposit-draft.store';
import { BankDepositService } from '../../../core/services/bank-deposit.service';
import { BankService } from '../../../core/services/bank.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { GuayacanCashSyncService } from '../../../core/services/guayacan-cash-sync.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TransaccionarPageComponent } from './transaccionar-page.component';

function recent(id: string, newBalance = 150000): CashMovement {
  return {
    id,
    sequence: 1,
    operationalDate: '2026-11-10',
    operationalDayId: null,
    cutPeriodId: null,
    cutPeriodNumber: null,
    movementType: 'RETIRO',
    originalMovementType: null,
    direction: 'OUT',
    amount: 850,
    previousBalance: newBalance + 850,
    newBalance,
    referenceType: 'BANK_DEPOSIT',
    referenceId: 'op-1',
    description: 'Retiros — 1 trans.',
    bankName: 'GTC',
    reason: null,
    reversalOfId: null,
    status: 'VIGENTE',
    voidedAt: null,
    voidedByUsername: null,
    voidReason: null,
    createdBy: 'u',
    createdByUsername: 'u',
    createdAt: '2026-11-10T20:00:00Z',
  };
}

/**
 * The six Transaccionar operations (Depósitos, Retiros, Desembolsos/Préstamos
 * Génesis, Reintegro, Pago varios) all go through this one form and this one
 * `confirmSave()` — so the payload rules below cover every one of them.
 */
describe('TransaccionarPageComponent — payload del desglose opcional y últimas transacciones', () => {
  let component: TransaccionarPageComponent;
  let draft: BankDepositDraftStore;
  let bankDepositService: BankDepositService;
  let confirmDialog: jasmine.SpyObj<ConfirmDialogService>;
  let registerSpy: jasmine.Spy;
  let recentSpy: jasmine.Spy;

  function sentPayload(): RegisterBankDepositInput {
    return registerSpy.calls.mostRecent().args[0] as RegisterBankDepositInput;
  }

  function prepareRetiro(total: number): void {
    draft.setTransactionType('type-1', 'Retiros', 'RETIRO');
    draft.setTransactionBank('agent-1');
    draft.setBankAccount('account-1');
    draft.setTotalAmount(total);
  }

  beforeEach(() => {
    confirmDialog = jasmine.createSpyObj<ConfirmDialogService>('ConfirmDialogService', ['confirm']);
    confirmDialog.confirm.and.resolveTo(true);

    TestBed.configureTestingModule({
      imports: [TransaccionarPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ConfirmDialogService, useValue: confirmDialog },
      ],
    });

    bankDepositService = TestBed.inject(BankDepositService);
    const cashControlService = TestBed.inject(CashControlService);
    recentSpy = spyOn(cashControlService, 'getRecentMovements').and.returnValue(of([recent('op-1')]));
    spyOn(cashControlService, 'getBalance').and.returnValue(of({ balance: 150000, lastSequence: 1, lastMovementAt: null }));
    spyOn(bankDepositService, 'getTransactionSummary').and.returnValue(NEVER);
    registerSpy = spyOn(bankDepositService, 'registerOperation').and.returnValue(NEVER);

    draft = TestBed.inject(BankDepositDraftStore);
    draft.reset();
    component = TestBed.createComponent(TransaccionarPageComponent).componentInstance;
  });

  afterEach(() => draft.reset());

  describe('descripción / beneficiario', () => {
    it('blocks saving without a description and tells the user why', () => {
      const warning = spyOn(TestBed.inject(NotificationService), 'warning');
      prepareRetiro(850);
      expect(component.canSubmit()).toBeTrue();

      component.requestSave();

      expect(warning).toHaveBeenCalledWith('Ingrese la descripción o el beneficiario de la transacción.');
      expect(component.isConfirmOpen()).toBeFalse();
      expect(component.descriptionTouched()).toBeTrue();
    });

    it('opens the confirmation once the description is filled', () => {
      prepareRetiro(850);
      component.onDescriptionInput('Juan Pérez - Pago de préstamo');
      component.requestSave();
      expect(component.isConfirmOpen()).toBeTrue();
    });

    it('sends the normalized description in the same registration request (every type uses this form)', () => {
      for (const [name, effect] of [
        ['Depósitos', 'DEPOSITO'],
        ['Retiros', 'RETIRO'],
        ['Desembolso Génesis', 'DESEMBOLSO_GENESIS'],
        ['Pago Génesis', 'PAGO_GENESIS'],
        ['Reintegro', 'REINTEGRO'],
        ['Pago varios', null],
      ] as const) {
        draft.reset();
        draft.setTransactionType('type-' + name, name, effect);
        draft.setTransactionBank('agent-1');
        draft.setBankAccount('account-1');
        draft.setTotalAmount(100);
        component.onDescriptionInput('  Ana   Martínez -\tDepósito  ');
        component.confirmSave();
        component.isSaving.set(false);
        expect(sentPayload().description).toBe('Ana Martínez - Depósito');
      }
      expect(registerSpy).toHaveBeenCalledTimes(6);
    });
  });

  it('sends no breakdown when the switch is NO (default)', () => {
    prepareRetiro(850);

    component.confirmSave();

    expect(sentPayload()).toEqual(
      jasmine.objectContaining({ cashBreakdownEnabled: false, cashDetails: [], changeGiven: 0, transactionAmounts: [850] }),
    );
  });

  it('sends the breakdown when the switch is SÍ', async () => {
    prepareRetiro(850);
    await component.onCashBreakdownToggle();
    draft.setCashQuantity(200, 4);
    draft.setCashQuantity(50, 1);

    component.confirmSave();

    expect(sentPayload().cashBreakdownEnabled).toBeTrue();
    expect(sentPayload().cashDetails).toEqual(
      jasmine.arrayWithExactContents([
        { denomination: 200, quantity: 4 },
        { denomination: 50, quantity: 1 },
      ]),
    );
  });

  it('SÍ → quantities → NO: those quantities never reach the payload', async () => {
    prepareRetiro(850);
    await component.onCashBreakdownToggle();
    draft.setCashQuantity(200, 5);

    await component.onCashBreakdownToggle();
    component.confirmSave();

    expect(confirmDialog.confirm).toHaveBeenCalledTimes(1);
    expect(sentPayload()).toEqual(jasmine.objectContaining({ cashBreakdownEnabled: false, cashDetails: [], changeGiven: 0 }));
    expect(sentPayload().totalAmount).toBe(850);
    expect(component.canSubmit()).toBeTrue();
  });

  it('keeps the breakdown if the user cancels turning it off', async () => {
    prepareRetiro(850);
    await component.onCashBreakdownToggle();
    draft.setCashQuantity(200, 1);
    confirmDialog.confirm.and.resolveTo(false);

    await component.onCashBreakdownToggle();

    expect(draft.cashBreakdownEnabled()).toBeTrue();
    expect(draft.totalCash()).toBe(200);
  });

  it('turning it OFF with nothing typed asks for no confirmation', async () => {
    await component.onCashBreakdownToggle();
    await component.onCashBreakdownToggle();
    expect(confirmDialog.confirm).not.toHaveBeenCalled();
  });

  it('blocks saving while the distribution does not match the monto', () => {
    prepareRetiro(1500);
    draft.setTransactionCount(3);
    draft.setTransactionAmount(0, 500);
    draft.setTransactionAmount(1, 600);

    expect(component.canSubmit()).toBeFalse();
    component.requestSave();
    expect(component.isConfirmOpen()).toBeFalse();

    draft.setTransactionAmount(2, 400);
    expect(component.canSubmit()).toBeTrue();
  });

  describe('Cooperativa Guayacán — vista previa del saldo al revés', () => {
    function prepare(effect: 'DEPOSITO' | 'RETIRO', cashBoxCode: 'GUAYACAN' | null, total: number): void {
      component.transactionBanks.set([
        { id: 'agent-1', name: 'Cooperativa', isActive: true, hasImage: false, cashBoxCode, commissionPerTransaction: cashBoxCode ? 3 : null, createdAt: '', updatedAt: '' },
      ]);
      component.bankAccounts.set([
        {
          id: 'account-1', name: 'Cooperativa Guayacán', accountNumber: '1', accountTypeId: 't', accountTypeName: 'Monetaria',
          previousBalance: 0, finalBalance: 1000, specialAccount: null, maxBalance: null,
          availableInTransaccionar: true, isActive: true, createdAt: '', updatedAt: '',
        },
      ]);
      draft.setTransactionType('type-1', effect, effect);
      draft.setTransactionBank('agent-1');
      draft.setBankAccount('account-1');
      draft.setTotalAmount(total);
    }

    it('Depósito Guayacán suma al saldo', () => {
      prepare('DEPOSITO', 'GUAYACAN', 200);
      expect(component.balancePreview()).toEqual({ before: 1000, after: 1200, amount: 200 });
    });

    it('Retiro Guayacán resta y avisa si no alcanza', () => {
      prepare('RETIRO', 'GUAYACAN', 300);
      expect(component.balancePreview()?.after).toBe(700);
      draft.setTotalAmount(1500);
      expect(component.balanceError()).toBe('Saldo insuficiente para realizar el retiro.');
    });

    it('la cuenta Guayacán (saldo = caja) avisa con el mensaje de la caja y sin límite máximo', () => {
      prepare('RETIRO', 'GUAYACAN', 1500);
      component.bankAccounts.update((accounts) => accounts.map((a) => ({ ...a, specialAccount: 'GUAYACAN' as const, maxBalance: 10 })));
      expect(component.balanceError()).toBe('Efectivo insuficiente en la Caja Guayacán para esta operación.');

      prepare('DEPOSITO', 'GUAYACAN', 5000);
      component.bankAccounts.update((accounts) => accounts.map((a) => ({ ...a, specialAccount: 'GUAYACAN' as const, maxBalance: 10 })));
      expect(component.balanceError()).toBeNull();
    });

    it('guardar una operación Guayacán avisa a las demás vistas (caja, tira de saldos, otras pestañas)', () => {
      const sync = TestBed.inject(GuayacanCashSyncService);
      const notify = spyOn(sync, 'notifyChanged');
      registerSpy.and.returnValue(of({ balanceMovement: null } as unknown as BankDepositOperation));
      prepare('DEPOSITO', 'GUAYACAN', 200);

      component.confirmSave();

      expect(notify).toHaveBeenCalledTimes(1);
    });

    it('una operación de otro banco no avisa', () => {
      const sync = TestBed.inject(GuayacanCashSyncService);
      const notify = spyOn(sync, 'notifyChanged');
      registerSpy.and.returnValue(of({ balanceMovement: null } as unknown as BankDepositOperation));
      prepare('DEPOSITO', null, 200);

      component.confirmSave();

      expect(notify).not.toHaveBeenCalled();
    });

    it('un cambio de efectivo de Guayacán (aquí u otra pestaña) re-lee las cuentas del backend', () => {
      const getBanks = spyOn(TestBed.inject(BankService), 'getBanks').and.returnValue(of([]));
      TestBed.inject(GuayacanCashSyncService).notifyChanged();
      expect(getBanks).toHaveBeenCalled();
    });

    it('otro banco agente: sin cambio (Depósito resta, Retiro suma)', () => {
      prepare('DEPOSITO', null, 200);
      expect(component.balancePreview()?.after).toBe(800);
      prepare('RETIRO', null, 200);
      expect(component.balancePreview()?.after).toBe(1200);
    });
  });

  it('loads the last 10 cash movements and the official balance on start', () => {
    expect(recentSpy).toHaveBeenCalledOnceWith(10);
    expect(component.recentMovements().map((row) => row.id)).toEqual(['op-1']);
    expect(component.cashBalance()).toBe(150000);
    expect(component.loadingRecent()).toBeFalse();
  });

  it('refreshes the recent movements after a successful save, newest first, with the backend cash balance', () => {
    prepareRetiro(850);
    registerSpy.and.returnValue(
      of({
        balanceMovement: null,
        cashMovement: { movementType: 'RETIRO', direction: 'OUT', amount: 850, previousBalance: 150000, newBalance: 149150, currentBalance: 149150 },
      } as unknown as BankDepositOperation),
    );
    recentSpy.and.returnValue(of([recent('op-new', 149150), recent('op-1')]));

    component.confirmSave();

    expect(recentSpy).toHaveBeenCalledTimes(2);
    expect(component.recentMovements().map((row) => row.id)).toEqual(['op-new', 'op-1']);
    expect(component.recentMovements()[0].newBalance).toBe(149150);
  });

  it('flags the error state when the recent query fails', () => {
    recentSpy.and.returnValue(throwError(() => new Error('boom')));

    component.loadRecentOperations();

    expect(component.recentFailed()).toBeTrue();
    expect(component.loadingRecent()).toBeFalse();
  });
});
