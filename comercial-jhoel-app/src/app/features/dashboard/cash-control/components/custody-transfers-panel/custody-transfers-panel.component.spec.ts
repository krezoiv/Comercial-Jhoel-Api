import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CustodyTransfer } from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { CustodyTransfersPanelComponent } from './custody-transfers-panel.component';

describe('CustodyTransfersPanelComponent (historial de traslados)', () => {
  it('sends the filters (type, user, dates, status) and resets to page 1', () => {
    TestBed.configureTestingModule({ imports: [CustodyTransfersPanelComponent], providers: [provideHttpClient(), provideHttpClientTesting()] });
    spyOn(TestBed.inject(CashControlService), 'getUsers').and.returnValue(of([{ id: 'u1', username: 'ana' }]));
    const item = { id: 't1', kind: 'BODEGA_A_CAJA', origin: 'BODEGA', destination: 'CAJA', bankName: null, details: [] } as unknown as CustodyTransfer;
    const spy = spyOn(TestBed.inject(CashCustodyService), 'getCustodyTransfers').and.returnValue(of({ items: [item], total: 1, page: 1, limit: 15 }));
    const panel = TestBed.createComponent(CustodyTransfersPanelComponent).componentInstance;
    panel.ngOnChanges();
    panel.kind.set('BODEGA_A_CAJA');
    panel.userId.set('u1');
    panel.dateFrom.set('2026-11-01');
    panel.status.set('APLICADO');
    panel.page.set(3);
    panel.applyFilters();
    expect(spy.calls.mostRecent().args[0]).toEqual(
      jasmine.objectContaining({ kind: 'BODEGA_A_CAJA', userId: 'u1', dateFrom: '2026-11-01', status: 'APLICADO', page: 1 }),
    );
    expect(panel.route(item)).toBe('Bodega → Caja');
    panel.clearFilters();
    expect(spy.calls.mostRecent().args[0].kind).toBeUndefined();
  });
});
