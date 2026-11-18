import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CashCustody, LocationInventory, WarehouseTransfer } from '../../../../../core/models';
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


/** Inventory as the backend returns it: 12 denominations, only those given non-zero. */
function inventoryOf(location: 'CAJA' | 'BODEGA', quantities: Record<number, number>, hasAnchor = true): LocationInventory {
  const denoms = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01];
  const lines = denoms.map((denomination) => {
    const quantity = quantities[denomination] ?? 0;
    return { denomination, quantity, subtotal: denomination * quantity };
  });
  const known = lines.reduce((sum, l) => sum + l.subtotal, 0);
  return { location, hasAnchor, anchorKind: hasAnchor ? (location === 'CAJA' ? 'ARQUEO_CAJA' : 'CONTEO_BODEGA') : null,
    anchorId: null, anchorNumber: 1, anchorAt: null, anchorByUsername: null, balance: known, knownTotal: known, unbroken: 0, lines };
}

describe('WarehouseTransferModalComponent (entrega a Bodega)', () => {
  let modal: WarehouseTransferModalComponent;
  let registerSpy: jasmine.Spy;
  let inventorySpy: jasmine.Spy;

  function open(overrides: Partial<CashCustody> = {}): void {
    modal.open = true;
    modal.custody = { ...custody, ...overrides };
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
    inventorySpy = spyOn(TestBed.inject(CashCustodyService), 'getInventory').and.returnValue(
      of({ cash: inventoryOf('CAJA', { 200: 500 }), warehouse: inventoryOf('BODEGA', {}) }),
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

  it('never saves without breakdown (also administrators) and shows the caja stock per denomination', () => {
    open();
    modal.amount.set(500);
    modal.receivedBy.set('Ana Bodega');
    expect(modal.canSave()).toBeFalse(); // no bills/coins entered
    expect(modal.available()?.['200']).toBe(500);
    expect(modal.available()?.['100']).toBe(0);
  });

  it('blocks more bills than the caja has, and a caja without a count', () => {
    inventorySpy.and.returnValue(of({ cash: inventoryOf('CAJA', { 200: 3 }), warehouse: inventoryOf('BODEGA', {}) }));
    open();
    modal.amount.set(800);
    modal.receivedBy.set('Ana Bodega');
    modal.onQuantityChange({ denomination: 200, quantity: 4 });
    expect(modal.overStock()).toBeTrue();
    expect(modal.canSave()).toBeFalse();
    modal.onQuantityChange({ denomination: 200, quantity: 3 });
    modal.amount.set(600);
    expect(modal.canSave()).toBeTrue();
    inventorySpy.and.returnValue(of({ cash: inventoryOf('CAJA', {}, false), warehouse: inventoryOf('BODEGA', {}) }));
    open();
    modal.amount.set(200);
    modal.receivedBy.set('Ana Bodega');
    modal.onQuantityChange({ denomination: 200, quantity: 1 });
    expect(modal.needsCount()).toBeTrue();
    expect(modal.canSave()).toBeFalse();
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
