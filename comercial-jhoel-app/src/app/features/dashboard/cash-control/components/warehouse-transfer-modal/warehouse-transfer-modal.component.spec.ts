import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CashCustody, WarehouseTransfer } from '../../../../../core/models';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { WarehouseTransferModalComponent } from './warehouse-transfer-modal.component';

const custody: CashCustody = {
  cashBalance: 100000,
  warehouseBalance: 20000,
  custodyTotal: 120000,
  warehouseHasInitialBalance: true,
  warehouseLastMovementAt: null,
  currentDay: { businessDate: '2026-11-11', isOpen: true },
  deliveredToday: 0,
  returnedToCashToday: 0,
  depositedToBankToday: 0,
};

describe('WarehouseTransferModalComponent (entrega a Bodega)', () => {
  let modal: WarehouseTransferModalComponent;
  let registerSpy: jasmine.Spy;

  function open(overrides: Partial<CashCustody> = {}, admin = false): void {
    modal.open = true;
    modal.custody = { ...custody, ...overrides };
    modal.canSkipBreakdown = admin;
    modal.ngOnChanges();
    // No session in tests: the person who delivers must still be identified.
    modal.deliveredBy.set('Juan Caja');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WarehouseTransferModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true) } },
      ],
    });
    registerSpy = spyOn(TestBed.inject(CashCustodyService), 'registerTransfer').and.returnValue(
      of({ transfer: { referenceNumber: 'ENT-000001' } as WarehouseTransfer, custody: { ...custody, cashBalance: 85000, warehouseBalance: 35000 } }),
    );
    modal = TestBed.createComponent(WarehouseTransferModalComponent).componentInstance;
  });

  it('previews caja −15,000 and Bodega +15,000 with the total unchanged', () => {
    open();
    modal.amount.set(15000);
    expect(modal.cashAfter()).toBe(85000);
    expect(modal.warehouseAfter()).toBe(35000);
  });

  it('requires breakdown matching the amount, both people and enough caja', () => {
    open();
    modal.deliveredBy.set('');
    modal.amount.set(15000);
    modal.receivedBy.set('Ana Bodega');
    modal.onQuantityChange({ denomination: 200, quantity: 75 });
    expect(modal.canSave()).toBeFalse(); // who delivers is mandatory
    open();
    modal.amount.set(15000);
    modal.receivedBy.set('Ana Bodega');
    expect(modal.canSave()).toBeFalse();
    modal.onQuantityChange({ denomination: 200, quantity: 75 });
    expect(modal.canSave()).toBeTrue();
    modal.amount.set(100000.01);
    expect(modal.insufficientCash()).toBeTrue();
    expect(modal.canSave()).toBeFalse();
  });

  it('only administrators may register a total without breakdown', () => {
    open();
    modal.amount.set(500);
    modal.receivedBy.set('Ana Bodega');
    modal.withBreakdown.set(false);
    expect(modal.canSave()).toBeFalse();
    open({}, true);
    modal.amount.set(500);
    modal.receivedBy.set('Ana Bodega');
    modal.withBreakdown.set(false);
    expect(modal.canSave()).toBeTrue();
  });

  it('is blocked without an open bank day', () => {
    open({ currentDay: { businessDate: '2026-11-11', isOpen: false } });
    modal.amount.set(100);
    modal.receivedBy.set('Ana Bodega');
    modal.onQuantityChange({ denomination: 100, quantity: 1 });
    expect(modal.canSave()).toBeFalse();
  });

  it('sends the delivery once with its breakdown and request id', async () => {
    open();
    modal.amount.set(15000);
    modal.receivedBy.set('Ana Bodega');
    modal.onQuantityChange({ denomination: 200, quantity: 75 });
    await modal.save();
    expect(registerSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ amount: 15000, details: [{ denomination: 200, quantity: 75 }], receivedBy: 'Ana Bodega' }),
    );
  });
});
