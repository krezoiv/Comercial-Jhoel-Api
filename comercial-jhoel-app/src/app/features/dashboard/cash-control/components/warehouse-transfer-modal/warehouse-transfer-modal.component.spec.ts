import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CashCustody, WarehouseTransfer } from '../../../../../core/models';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { WarehouseTransferModalComponent, exceedsCashMessage } from './warehouse-transfer-modal.component';

const custody: CashCustody = {
  cashBalance: 5000,
  warehouseBalance: 20000,
  custodyTotal: 25000,
  warehouseHasInitialBalance: true,
  warehouseLastMovementAt: null,
  currentDay: { businessDate: '2026-11-11', isOpen: true },
  deliveredToday: 0,
  returnedToCashToday: 0,
  depositedToBankToday: 0,
};

describe('WarehouseTransferModalComponent (traslado de Caja a Bodega)', () => {
  let modal: WarehouseTransferModalComponent;
  let registerSpy: jasmine.Spy;
  let custodySpy: jasmine.Spy;
  let inventorySpy: jasmine.Spy;
  let confirmSpy: jasmine.Spy;

  function open(overrides: Partial<CashCustody> = {}): void {
    custodySpy.and.returnValue(of({ ...custody, ...overrides }));
    modal.open = true;
    modal.custody = custody;
    modal.ngOnChanges();
    // No session in tests: the person who delivers must still be identified.
    modal.deliveredBy.set('Juan Caja');
    modal.receivedBy.set('Ana Bodega');
  }

  beforeEach(() => {
    confirmSpy = jasmine.createSpy('confirm').and.resolveTo(true);
    TestBed.configureTestingModule({
      imports: [WarehouseTransferModalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: ConfirmDialogService, useValue: { confirm: confirmSpy } }],
    });
    const service = TestBed.inject(CashCustodyService);
    registerSpy = spyOn(service, 'registerTransfer').and.returnValue(
      of({ transfer: { referenceNumber: 'ENT-000001' } as WarehouseTransfer, custody: { ...custody, cashBalance: 2000, warehouseBalance: 23000 } }),
    );
    custodySpy = spyOn(service, 'getCustody').and.returnValue(of(custody));
    inventorySpy = spyOn(service, 'getInventory').and.callThrough();
    modal = TestBed.createComponent(WarehouseTransferModalComponent).componentInstance;
  });

  it('reads the official caja balance from the backend on open — never the arqueo inventory', () => {
    open({ cashBalance: 5000 });
    expect(custodySpy).toHaveBeenCalled();
    expect(inventorySpy).not.toHaveBeenCalled();
    expect(modal.cashBalance()).toBe(5000);
  });

  it('caso 1: with no arqueo at all a transfer within the balance can be confirmed', () => {
    open();
    modal.onQuantityChange({ denomination: 200, quantity: 15 });
    expect(modal.amount()).toBe(3000);
    expect(modal.cashAfter()).toBe(2000);
    expect(modal.warehouseAfter()).toBe(23000);
    expect(modal.canSave()).toBeTrue();
  });

  it('the amount is the breakdown total (Q2,419.00 example) and cannot disagree with it', () => {
    open();
    const rows: Array<[number, number]> = [
      [200, 5], [100, 5], [50, 10], [20, 10], [10, 10], [5, 10],
      [1, 50], [0.5, 20], [0.25, 20], [0.1, 20], [0.05, 20], [0.01, 100],
    ];
    for (const [denomination, quantity] of rows) {
      modal.onQuantityChange({ denomination, quantity });
    }
    expect(modal.amount()).toBe(2419);
    expect(modal.cashAfter()).toBe(2581);
  });

  it('caso 3: over the available cash shows the error and blocks the confirmation', () => {
    open();
    modal.onQuantityChange({ denomination: 200, quantity: 25 });
    modal.onQuantityChange({ denomination: 1, quantity: 1 });
    expect(modal.amount()).toBe(5001);
    expect(modal.exceedsCash()).toBeTrue();
    expect(modal.breakdownStatus()).toBe('red');
    expect(modal.canSave()).toBeFalse();
    expect(modal.exceedsMessage()).toBe(exceedsCashMessage(5000));
    expect(exceedsCashMessage(5000)).toContain('No puedes trasladar más efectivo del disponible en Caja. Efectivo disponible: Q');
    modal.onQuantityChange({ denomination: 1, quantity: 0 });
    expect(modal.canSave()).toBeTrue(); // exactly all the cash is allowed
  });

  it('needs bills/coins, both people and an open bank day', () => {
    open();
    expect(modal.canSave()).toBeFalse(); // nothing entered
    modal.onQuantityChange({ denomination: 100, quantity: 1 });
    modal.receivedBy.set('');
    expect(modal.canSave()).toBeFalse();
    open({ currentDay: { businessDate: '2026-11-11', isOpen: false } });
    modal.onQuantityChange({ denomination: 100, quantity: 1 });
    expect(modal.canSave()).toBeFalse();
  });

  it('shows the summary before confirming and sends once with the breakdown and request id', async () => {
    open();
    modal.onQuantityChange({ denomination: 200, quantity: 15 });
    modal.observations.set('Fin de turno');
    await modal.save();
    const message = confirmSpy.calls.mostRecent().args[0].message as string;
    expect(message).toContain('Efectivo disponible antes del traslado');
    expect(message).toContain('Total trasladado');
    expect(message).toContain('Efectivo restante en Caja');
    expect(message).toContain('Total que ingresará a Bodega');
    expect(registerSpy).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        amount: 3000,
        details: [{ denomination: 200, quantity: 15 }],
        receivedBy: 'Ana Bodega',
        observations: 'Fin de turno',
      }),
    );
  });

  it('nothing is sent when the summary is cancelled', async () => {
    confirmSpy.and.resolveTo(false);
    open();
    modal.onQuantityChange({ denomination: 200, quantity: 1 });
    await modal.save();
    expect(registerSpy).not.toHaveBeenCalled();
  });

  it('a backend rejection is shown and the balance is read again', async () => {
    registerSpy.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { message: exceedsCashMessage(1000) } })),
    );
    open();
    modal.onQuantityChange({ denomination: 200, quantity: 10 });
    const calls = custodySpy.calls.count();
    await modal.save();
    expect(modal.errorMessage()).toContain('No puedes trasladar más efectivo');
    expect(custodySpy.calls.count()).toBe(calls + 1);
  });
});
