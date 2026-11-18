import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LocationInventory, WarehouseCashCount } from '../../../../../core/models';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { WarehouseCountModalComponent } from './warehouse-count-modal.component';

const bodega = (hasAnchor: boolean, balance: number, lines: Array<[number, number]> = []): LocationInventory => ({
  location: 'BODEGA', hasAnchor, anchorKind: hasAnchor ? 'CONTEO_BODEGA' : null, anchorId: null, anchorNumber: null,
  anchorAt: null, anchorByUsername: null, balance, knownTotal: balance, unbroken: 0,
  lines: lines.map(([denomination, quantity]) => ({ denomination, quantity, subtotal: denomination * quantity })),
});

describe('WarehouseCountModalComponent (conteo de Bodega)', () => {
  let modal: WarehouseCountModalComponent;
  let registerSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WarehouseCountModalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true) } }],
    });
    registerSpy = spyOn(TestBed.inject(CashCustodyService), 'registerWarehouseCount').and.returnValue(
      of({ count: { number: 1 } as WarehouseCashCount, inventory: bodega(true, 7100) }),
    );
    modal = TestBed.createComponent(WarehouseCountModalComponent).componentInstance;
  });

  it('only saves when the counted bills/coins equal the Bodega balance', async () => {
    modal.open = true;
    modal.inventory = bodega(false, 7100);
    modal.ngOnChanges();
    modal.onQuantityChange({ denomination: 200, quantity: 20 });
    modal.onQuantityChange({ denomination: 100, quantity: 15 });
    expect(modal.canSave()).toBeFalse(); // 5,500 ≠ 7,100
    modal.onQuantityChange({ denomination: 50, quantity: 10 });
    modal.onQuantityChange({ denomination: 20, quantity: 30 });
    modal.onQuantityChange({ denomination: 10, quantity: 20 });
    modal.onQuantityChange({ denomination: 5, quantity: 40 });
    modal.onQuantityChange({ denomination: 1, quantity: 100 });
    expect(modal.totalCounted()).toBe(7100);
    expect(modal.canSave()).toBeTrue();
    await modal.save();
    const input = registerSpy.calls.mostRecent().args[0];
    expect(input.details.length).toBe(12);
    expect(input.clientRequestId).toBeTruthy();
  });

  it('pre-fills with the current Bodega inventory when it already has a count', () => {
    modal.open = true;
    modal.inventory = bodega(true, 1000, [[200, 5]]);
    modal.ngOnChanges();
    expect(modal.cashCounts()['200']).toBe(5);
    expect(modal.canSave()).toBeTrue();
  });
});
