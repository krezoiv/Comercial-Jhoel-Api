import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, of, throwError } from 'rxjs';

import { BankDepositOperation, BankDepositOperationSummary, RegisterBankDepositInput } from '../../../core/models';
import { BankDepositDraftStore } from '../../../core/services/bank-deposit-draft.store';
import { BankDepositService } from '../../../core/services/bank-deposit.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { TransaccionarPageComponent } from './transaccionar-page.component';

function recent(id: string): BankDepositOperationSummary {
  return {
    id,
    transactionBankId: 'agent-1',
    transactionBankName: 'GTC',
    bankAccountId: 'account-1',
    bankAccountName: 'GTC',
    bankAccountNumber: '1',
    totalAmount: 850,
    transactionCount: 1,
    operationDate: '2026-11-02',
    clientName: null,
    clientId: null,
    transactionTypeId: 'type-1',
    transactionTypeName: 'Retiros',
    userId: 'u',
    username: 'u',
    createdAt: '2026-11-02T20:00:00Z',
    isVoided: false,
    voidedAt: null,
    voidedByUsername: null,
    voidReason: null,
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
    recentSpy = spyOn(bankDepositService, 'getRecentOperations').and.returnValue(of([recent('op-1')]));
    spyOn(bankDepositService, 'getTransactionSummary').and.returnValue(NEVER);
    registerSpy = spyOn(bankDepositService, 'registerOperation').and.returnValue(NEVER);

    draft = TestBed.inject(BankDepositDraftStore);
    draft.reset();
    component = TestBed.createComponent(TransaccionarPageComponent).componentInstance;
  });

  afterEach(() => draft.reset());

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

    it('otro banco agente: sin cambio (Depósito resta, Retiro suma)', () => {
      prepare('DEPOSITO', null, 200);
      expect(component.balancePreview()?.after).toBe(800);
      prepare('RETIRO', null, 200);
      expect(component.balancePreview()?.after).toBe(1200);
    });
  });

  it('loads the recent operations on start', () => {
    expect(recentSpy).toHaveBeenCalledTimes(1);
    expect(component.recentOperations().map((row) => row.id)).toEqual(['op-1']);
    expect(component.loadingRecent()).toBeFalse();
  });

  it('refreshes the recent operations after a successful save, newest first', () => {
    prepareRetiro(850);
    registerSpy.and.returnValue(of({ balanceMovement: null } as unknown as BankDepositOperation));
    recentSpy.and.returnValue(of([recent('op-new'), recent('op-1')]));

    component.confirmSave();

    expect(recentSpy).toHaveBeenCalledTimes(2);
    expect(component.recentOperations().map((row) => row.id)).toEqual(['op-new', 'op-1']);
  });

  it('flags the error state when the recent query fails', () => {
    recentSpy.and.returnValue(throwError(() => new Error('boom')));

    component.loadRecentOperations();

    expect(component.recentFailed()).toBeTrue();
    expect(component.loadingRecent()).toBeFalse();
  });
});
