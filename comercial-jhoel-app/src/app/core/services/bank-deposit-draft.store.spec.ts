import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { BankDepositDraftStore } from './bank-deposit-draft.store';

const USER_ID = 'user-spec';
const STORAGE_KEY = `cj_bank_deposit_draft:${USER_ID}`;

describe('BankDepositDraftStore — desglose opcional y distribución automática', () => {
  let store: BankDepositDraftStore;

  function createStore(): BankDepositDraftStore {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { currentUser: signal({ id: USER_ID }) } }],
    });
    return TestBed.inject(BankDepositDraftStore);
  }

  /** A Retiro-like type on a picked bank/account — everything `canSave` needs besides the cuadre. */
  function selectOperation(target: BankDepositDraftStore): void {
    target.setTransactionType('type-1', 'Retiros', 'RETIRO');
    target.setTransactionBank('agent-1');
    target.setBankAccount('account-1');
  }

  beforeEach(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    store = createStore();
  });

  afterEach(() => sessionStorage.removeItem(STORAGE_KEY));

  describe('interruptor de desglose', () => {
    it('starts in NO', () => {
      expect(store.cashBreakdownEnabled()).toBeFalse();
    });

    it('saves without a breakdown: only the distribution has to cuadrar', () => {
      selectOperation(store);
      store.setTotalAmount(850);

      expect(store.totalCash()).toBe(0);
      expect(store.overallStatus()).toBe('green');
      expect(store.canSave()).toBeTrue();
    });

    it('turning it ON makes the cash cuadre mandatory again (current validation)', () => {
      selectOperation(store);
      store.setTotalAmount(850);
      store.setCashBreakdownEnabled(true);

      expect(store.canSave()).toBeFalse();
      expect(store.cashStatus()).toBe('yellow');

      store.setCashQuantity(200, 4);
      store.setCashQuantity(50, 1);
      expect(store.totalCash()).toBe(850);
      expect(store.cashStatus()).toBe('green');
      expect(store.canSave()).toBeTrue();

      store.setCashQuantity(100, 1);
      expect(store.cashStatus()).toBe('red');
      expect(store.canSave()).toBeFalse();
    });

    it('turning it OFF discards typed quantities and any vuelto, without touching monto or distribution', () => {
      selectOperation(store);
      store.setTotalAmount(150);
      store.setCashBreakdownEnabled(true);
      store.setCashQuantity(200, 1);
      store.confirmChange(store.excessAmount());
      expect(store.changeConfirmed()).toBeTrue();

      store.setCashBreakdownEnabled(false);

      expect(store.totalCash()).toBe(0);
      expect(Object.values(store.cashCounts()).every((quantity) => quantity === 0)).toBeTrue();
      expect(store.changeConfirmed()).toBeFalse();
      expect(store.changeGiven()).toBe(0);
      expect(store.hasPendingChange()).toBeFalse();
      expect(store.totalAmount()).toBe(150);
      expect(store.transactionAmounts()).toEqual([150]);
      expect(store.canSave()).toBeTrue();
    });

    it('turning it back ON after OFF starts from an empty breakdown (no stale values)', () => {
      store.setTotalAmount(100);
      store.setCashBreakdownEnabled(true);
      store.setCashQuantity(100, 1);
      store.setCashBreakdownEnabled(false);
      store.setCashBreakdownEnabled(true);

      expect(store.totalCash()).toBe(0);
    });

    it('reset() goes back to NO', () => {
      store.setCashBreakdownEnabled(true);
      store.reset();
      expect(store.cashBreakdownEnabled()).toBeFalse();
    });
  });

  describe('distribución de transacciones', () => {
    it('starts with exactly one row', () => {
      expect(store.transactionAmounts().length).toBe(1);
    });

    it('the single row mirrors the monto, live', () => {
      store.setTotalAmount(850);
      expect(store.transactionAmounts()).toEqual([850]);
      expect(store.totalDistributed()).toBe(850);

      store.setTotalAmount(1200);
      expect(store.transactionAmounts()).toEqual([1200]);
      expect(store.transactionsStatus()).toBe('green');
    });

    it('with several rows, amounts are manual and must sum to the monto exactly', () => {
      selectOperation(store);
      store.setTotalAmount(1500);
      store.setTransactionCount(3);
      expect(store.transactionAmounts()).toEqual([1500, 0, 0]);

      store.setTransactionAmount(0, 500);
      store.setTransactionAmount(1, 600);
      expect(store.transactionsStatus()).toBe('yellow');
      expect(store.canSave()).toBeFalse();

      store.setTransactionAmount(2, 400);
      expect(store.totalDistributed()).toBe(1500);
      expect(store.canSave()).toBeTrue();

      store.setTransactionAmount(2, 500);
      expect(store.transactionsStatus()).toBe('red');
      expect(store.canSave()).toBeFalse();
    });

    it('changing the monto with several rows never silently overwrites the manual amounts', () => {
      selectOperation(store);
      store.setTotalAmount(1500);
      store.setTransactionCount(2);
      store.setTransactionAmount(0, 1000);
      store.setTransactionAmount(1, 500);

      store.setTotalAmount(1600);

      expect(store.transactionAmounts()).toEqual([1000, 500]);
      expect(store.transactionsStatus()).toBe('yellow');
      expect(store.canSave()).toBeFalse();
    });

    it('going back to 1 rebuilds a single row equal to the monto', () => {
      store.setTotalAmount(1500);
      store.setTransactionCount(3);
      store.setTransactionAmount(0, 500);

      store.setTransactionCount(1);

      expect(store.transactionAmounts()).toEqual([1500]);
    });

    it('works the same with the desglose ON (independent features)', () => {
      selectOperation(store);
      store.setCashBreakdownEnabled(true);
      store.setTotalAmount(300);
      store.setCashQuantity(100, 3);

      expect(store.transactionAmounts()).toEqual([300]);
      expect(store.canSave()).toBeTrue();
    });

    it('the automatic single row is not "progress" by itself', () => {
      store.setTransactionType('type-1', 'Retiros', 'RETIRO');
      expect(store.hasMeaningfulProgress()).toBeFalse();
    });

    it('reset() goes back to one row', () => {
      store.setTotalAmount(100);
      store.setTransactionCount(4);
      store.reset();
      expect(store.transactionAmounts()).toEqual([0]);
    });
  });

  describe('persistencia', () => {
    it('restores the toggle state', () => {
      store.setTotalAmount(100);
      store.setCashBreakdownEnabled(true);
      store.setCashQuantity(100, 1);

      const restored = createStore();

      expect(restored.cashBreakdownEnabled()).toBeTrue();
      expect(restored.totalCash()).toBe(100);
    });

    it('a draft saved before the toggle existed keeps its breakdown ON, and an empty distribution becomes one row', () => {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transactionTypeId: 'type-1',
          transactionTypeName: 'Depósito',
          transactionBankId: 'agent-1',
          totalAmount: 200,
          cashCounts: { '200': 1 },
          transactionAmounts: [],
          clientName: '',
          clientId: null,
          clientDisplayName: null,
          sendToAccountsReceivable: false,
          changeGiven: 0,
          changeConfirmed: false,
        }),
      );

      const restored = createStore();

      expect(restored.cashBreakdownEnabled()).toBeTrue();
      expect(restored.totalCash()).toBe(200);
      expect(restored.transactionAmounts()).toEqual([200]);
    });

    it('a restored draft with the toggle OFF never carries quantities or vuelto', () => {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transactionTypeId: 'type-1',
          transactionTypeName: 'Depósito',
          transactionBankId: 'agent-1',
          totalAmount: 200,
          cashBreakdownEnabled: false,
          cashCounts: { '200': 1 },
          transactionAmounts: [200],
          clientName: '',
          clientId: null,
          clientDisplayName: null,
          sendToAccountsReceivable: false,
          changeGiven: 50,
          changeConfirmed: true,
        }),
      );

      const restored = createStore();

      expect(restored.totalCash()).toBe(0);
      expect(restored.changeConfirmed()).toBeFalse();
      expect(restored.changeGiven()).toBe(0);
    });
  });
});
