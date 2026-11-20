import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { CashCountDraft, CashCountRecord, CashCustody } from '../../../../../core/models';
import { AuthService } from '../../../../../core/services/auth.service';
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
  returnedToCashToday: 0,
  depositedToBankToday: 0,
};

describe('CashCountModalComponent (arqueo de caja)', () => {
  let modal: CashCountModalComponent;
  let registerSpy: jasmine.Spy;
  let correctSpy: jasmine.Spy;
  let getDraftSpy: jasmine.Spy;
  let saveDraftSpy: jasmine.Spy;
  let discardSpy: jasmine.Spy;
  const LOCAL_KEY = 'cj_cash_count_draft:user-1:2026-11-11';

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
    getDraftSpy = spyOn(service, 'getCountDraft').and.returnValue(of(null));
    saveDraftSpy = spyOn(service, 'saveCountDraft').and.callFake((payload) =>
      of({ businessDate: '2026-11-11', payload, version: 1, updatedAt: new Date().toISOString() } as CashCountDraft),
    );
    discardSpy = spyOn(service, 'discardCountDraft').and.returnValue(of(undefined));
    TestBed.inject(AuthService).currentUser.set({ id: 'user-1', username: 'ana', phone: '', role: 'SUPERVISOR_DE_TURNO' } as never);
    localStorage.removeItem(LOCAL_KEY);
    modal = TestBed.createComponent(CashCountModalComponent).componentInstance;
  });

  afterEach(() => localStorage.removeItem(LOCAL_KEY));

  it('counts the caja only (Bodega excluded) and previews the shortage', () => {
    open();
    modal.onQuantityChange({ denomination: 200, quantity: 422 });
    modal.onQuantityChange({ denomination: 100, quantity: 1 });
    expect(modal.totalCounted()).toBe(84500);
    expect(modal.theoretical()).toBe(85000);
    expect(modal.previewDifference()).toBe(-500);
    // Bodega is its official balance: shown in the total bajo resguardo, never in the difference.
    expect(modal.warehouseTheoretical()).toBe(35000);
    expect(modal.custodyTotal()).toBe(119500);
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
    expect(input.details.length).toBe(12);
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

  describe('borrador del arqueo (persistencia real)', () => {
    const serverDraft: CashCountDraft = {
      businessDate: '2026-11-11',
      payload: { details: [{ denomination: 200, quantity: 40 }, { denomination: 0.01, quantity: 7 }], observations: 'A medias' },
      version: 3,
      updatedAt: '2026-11-11T16:00:00Z',
    };

    it('restores the server draft when the form opens again (navigation, reload or a new login)', () => {
      getDraftSpy.and.returnValue(of(serverDraft));
      open();
      expect(modal.cashCounts()['200']).toBe(40);
      expect(modal.cashCounts()['0.01']).toBe(7);
      expect(modal.observations()).toBe('A medias');
      expect(modal.totalCounted()).toBe(8000.07);
      expect(modal.draftRestored()).toBeTrue();
      expect(modal.draftStatus()).toBe('saved');
    });

    it('autosaves every change (debounced) and shows "Guardado correctamente"', fakeAsync(() => {
      open();
      modal.onQuantityChange({ denomination: 100, quantity: 3 });
      modal.setObservations('Conteo en proceso');
      expect(modal.draftStatus()).toBe('saving');
      expect(saveDraftSpy).not.toHaveBeenCalled();
      tick(800);
      expect(saveDraftSpy).toHaveBeenCalledTimes(1);
      const payload = saveDraftSpy.calls.mostRecent().args[0];
      expect(payload.details.find((d: { denomination: number }) => d.denomination === 100).quantity).toBe(3);
      expect(payload.observations).toBe('Conteo en proceso');
      expect(modal.draftStatus()).toBe('saved');
      // The local copy is written immediately too.
      expect(JSON.parse(localStorage.getItem(LOCAL_KEY)!).payload.observations).toBe('Conteo en proceso');
    }));

    it('shows "Error al guardar" and keeps the quantities in the browser when the server fails', fakeAsync(() => {
      saveDraftSpy.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'No hay un día operativo abierto' } })));
      open();
      modal.onQuantityChange({ denomination: 50, quantity: 9 });
      tick(800);
      expect(modal.draftStatus()).toBe('error');
      expect(modal.draftError()).toContain('se conservan en este navegador');
      expect(modal.cashCounts()['50']).toBe(9);
      expect(localStorage.getItem(LOCAL_KEY)).toContain('"quantity":9');
    }));

    it('a local copy newer than the server one wins and is re-synced (autosave interrupted by a reload)', () => {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({
        payload: { details: [{ denomination: 20, quantity: 11 }], observations: null },
        savedAt: '2026-11-11T17:00:00Z',
      }));
      getDraftSpy.and.returnValue(of(serverDraft)); // older (16:00)
      open();
      expect(modal.cashCounts()['20']).toBe(11);
      expect(modal.cashCounts()['200']).toBe(0);
      expect(saveDraftSpy).toHaveBeenCalled();
    });

    it('clears the draft only after a valid confirmation (server deletes it; local copy dropped)', async () => {
      open();
      modal.onQuantityChange({ denomination: 200, quantity: 5 });
      expect(localStorage.getItem(LOCAL_KEY)).not.toBeNull();
      await modal.save();
      expect(localStorage.getItem(LOCAL_KEY)).toBeNull();
      expect(discardSpy).not.toHaveBeenCalled();
    });

    it('a failed confirmation keeps everything', async () => {
      registerSpy.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409 })));
      open();
      modal.onQuantityChange({ denomination: 200, quantity: 5 });
      await modal.save();
      expect(localStorage.getItem(LOCAL_KEY)).not.toBeNull();
      expect(modal.cashCounts()['200']).toBe(5);
    });

    it('"Reiniciar arqueo" is explicit: it empties the form and discards the draft', async () => {
      getDraftSpy.and.returnValue(of(serverDraft));
      open();
      await modal.resetDraft();
      expect(discardSpy).toHaveBeenCalled();
      expect(modal.totalCounted()).toBe(0);
      expect(localStorage.getItem(LOCAL_KEY)).toBeNull();
    });

    it('a correction never reads nor writes drafts', fakeAsync(() => {
      const original = { id: 'c0', number: 7, systemCash: 1, warehouseBalance: 0, warehouseCounted: null,
        countedAt: '2026-11-11T15:00:00Z', businessDate: '2026-11-11', observations: null, details: [] } as unknown as CashCountRecord;
      open(original);
      modal.onQuantityChange({ denomination: 200, quantity: 1 });
      tick(1000);
      expect(getDraftSpy).not.toHaveBeenCalled();
      expect(saveDraftSpy).not.toHaveBeenCalled();
    }));
  });
});
