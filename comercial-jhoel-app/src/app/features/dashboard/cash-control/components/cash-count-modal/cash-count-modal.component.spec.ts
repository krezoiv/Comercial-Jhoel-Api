import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CashCountRecord, CashCustody } from '../../../../../core/models';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { CashCountModalComponent } from './cash-count-modal.component';

const custody: CashCustody = {
  cashBalance: 85000,
  warehouseBalance: 35000,
  custodyTotal: 120000,
  warehouseHasInitialBalance: true,
  warehouseLastMovementAt: null,
  currentDay: { businessDate: '2026-11-11', isOpen: true },
  deliveredToday: 15000,
};

describe('CashCountModalComponent (arqueo de caja)', () => {
  let modal: CashCountModalComponent;
  let registerSpy: jasmine.Spy;
  let correctSpy: jasmine.Spy;

  function open(correction: CashCountRecord | null = null): void {
    modal.open = true;
    modal.custody = custody;
    modal.correctionOf = correction;
    modal.ngOnChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CashCountModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true) } },
      ],
    });
    const service = TestBed.inject(CashCustodyService);
    const saved = { id: 'c1', number: 1, result: 'FALTANTE', difference: -500 } as CashCountRecord;
    registerSpy = spyOn(service, 'registerCount').and.returnValue(of(saved));
    correctSpy = spyOn(service, 'correctCount').and.returnValue(of(saved));
    modal = TestBed.createComponent(CashCountModalComponent).componentInstance;
  });

  it('counts the caja only (Bodega excluded) and previews the shortage', () => {
    open();
    modal.onQuantityChange({ denomination: 200, quantity: 422 });
    modal.onQuantityChange({ denomination: 100, quantity: 1 });
    expect(modal.totalCounted()).toBe(84500);
    expect(modal.theoretical()).toBe(85000);
    expect(modal.previewDifference()).toBe(-500);
    expect(modal.warehouseTheoretical()).toBe(35000);
  });

  it('accepts only whole, non-negative quantities', () => {
    open();
    modal.onQuantityChange({ denomination: 50, quantity: -3 });
    modal.onQuantityChange({ denomination: 20, quantity: 2.7 });
    expect(modal.cashCounts()['50']).toBe(0);
    expect(modal.cashCounts()['20']).toBe(2);
  });

  it('sends all 11 denominations and one request id; the official result comes back from the backend', async () => {
    open();
    modal.onQuantityChange({ denomination: 200, quantity: 425 });
    await modal.save();
    const input = registerSpy.calls.mostRecent().args[0];
    expect(input.details.length).toBe(11);
    expect(input.clientRequestId).toBeTruthy();
    expect(input.warehouseCounted).toBeUndefined();
    expect(modal.result()?.result).toBe('FALTANTE');
  });

  it('a correction keeps the original photograph and requires a reason', async () => {
    const original = {
      id: 'c0',
      number: 7,
      systemCash: 85000,
      warehouseBalance: 35000,
      warehouseCounted: null,
      countedAt: '2026-11-11T15:00:00Z',
      businessDate: '2026-11-11',
      observations: null,
      details: [{ denomination: 200, quantity: 422, subtotal: 84400 }],
    } as unknown as CashCountRecord;
    open(original);
    expect(modal.cashCounts()['200']).toBe(422);
    expect(modal.canSave()).toBeFalse();
    modal.reason.set('Fajo contado dos veces');
    expect(modal.canSave()).toBeTrue();
    await modal.save();
    expect(correctSpy).toHaveBeenCalledWith('c0', jasmine.objectContaining({ reason: 'Fajo contado dos veces' }));
  });
});
