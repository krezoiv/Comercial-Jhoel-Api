import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CashCustody, WarehouseWithdrawal } from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { WarehouseWithdrawalModalComponent } from './warehouse-withdrawal-modal.component';

const custody: CashCustody = {
  cashBalance: 85000,
  warehouseBalance: 35000,
  custodyTotal: 120000,
  warehouseHasInitialBalance: true,
  warehouseLastMovementAt: null,
  currentDay: { businessDate: '2026-11-11', isOpen: true },
  deliveredToday: 15000,
  returnedToCashToday: 0,
  depositedToBankToday: 0,
};

describe('WarehouseWithdrawalModalComponent (retiro de Bodega)', () => {
  let modal: WarehouseWithdrawalModalComponent;
  let registerSpy: jasmine.Spy;

  function open(admin = false): void {
    modal.open = true;
    modal.custody = custody;
    modal.canSkipBreakdown = admin;
    modal.ngOnChanges();
    modal.deliveredBy.set('Ana Bodega');
    modal.receivedBy.set('Juan Caja');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WarehouseWithdrawalModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true) } },
      ],
    });
    spyOn(TestBed.inject(CashControlService), 'getBankBalances').and.returnValue(
      of([
        { bankId: 'b1', bankName: 'Banco Industrial', accountNumber: '123', specialAccount: 'BANCO_INDUSTRIAL', balance: 50000 },
        { bankId: 'g', bankName: 'Cooperativa Guayacán', accountNumber: null, specialAccount: 'GUAYACAN', balance: 0 },
      ]),
    );
    registerSpy = spyOn(TestBed.inject(CashCustodyService), 'registerWithdrawal').and.returnValue(
      of({ withdrawal: { referenceNumber: 'RET-000001' } as WarehouseWithdrawal, custody }),
    );
    modal = TestBed.createComponent(WarehouseWithdrawalModalComponent).componentInstance;
  });

  it('to caja: previews Bodega −5,000 and caja +5,000 (internal transfer)', () => {
    open();
    modal.amount.set(5000);
    expect(modal.warehouseAfter()).toBe(30000);
    expect(modal.targetAfter()).toBe(90000);
  });

  it('to bank: needs an account (Guayacán never offered) and previews the account', () => {
    open();
    modal.destination.set('BANCO');
    modal.amount.set(10000);
    modal.onQuantityChange({ denomination: 200, quantity: 50 });
    expect(modal.banks().map((b) => b.bankId)).toEqual(['b1']);
    expect(modal.canSave()).toBeFalse();
    modal.bankId.set('b1');
    expect(modal.targetAfter()).toBe(60000);
    expect(modal.canSave()).toBeTrue();
  });

  it('cannot withdraw more than Bodega has; without breakdown only administrators', () => {
    open();
    modal.amount.set(35000.01);
    expect(modal.insufficient()).toBeTrue();
    modal.amount.set(100);
    modal.withBreakdown.set(false);
    expect(modal.canSave()).toBeFalse();
    open(true);
    modal.amount.set(100);
    modal.withBreakdown.set(false);
    expect(modal.canSave()).toBeTrue();
  });

  it('sends one request with destination, bank and breakdown', async () => {
    open();
    modal.destination.set('BANCO');
    modal.bankId.set('b1');
    modal.amount.set(10000);
    modal.onQuantityChange({ denomination: 200, quantity: 50 });
    await modal.save();
    expect(registerSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ destination: 'BANCO', bankId: 'b1', amount: 10000, details: [{ denomination: 200, quantity: 50 }] }),
    );
  });
});
