import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AccountReceivable } from '../../../core/models';
import { NotificationService } from '../../../core/services/notification.service';
import { AccountsReceivablePageComponent } from './accounts-receivable-page.component';

function record(id: string, clientId: string, pending: number): AccountReceivable {
  return {
    id,
    clientId,
    clientName: clientId === 'c1' ? 'Cliente A' : 'Cliente B',
    date: '2026-11-10',
    amount: pending,
    movementType: 'CARGO',
    description: null,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    createdByUsername: 'admin',
    updatedByUsername: null,
    pendingAmount: pending,
    paidAmount: 0,
    paymentStatus: 'PENDIENTE',
  };
}

describe('AccountsReceivablePageComponent (selección para cancelación múltiple)', () => {
  let page: AccountsReceivablePageComponent;
  let warning: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountsReceivablePageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    warning = spyOn(TestBed.inject(NotificationService), 'warning');
    page = TestBed.createComponent(AccountsReceivablePageComponent).componentInstance;
  });

  it('counts and totals the selected accounts of one client', () => {
    page.toggleSelect(record('a', 'c1', 500));
    page.toggleSelect(record('b', 'c1', 1000));
    page.toggleSelect(record('c', 'c1', 750));
    expect(page.selectedCount()).toBe(3);
    expect(page.selectedTotal()).toBe(2250);
    expect(page.selectionClientName()).toBe('Cliente A');

    page.toggleSelect(record('b', 'c1', 1000));
    expect(page.selectedCount()).toBe(2);
    expect(page.selectedTotal()).toBe(1250);
  });

  it('refuses an account of another client until the selection is cleared', () => {
    page.toggleSelect(record('a', 'c1', 500));
    page.toggleSelect(record('x', 'c2', 300));
    expect(warning).toHaveBeenCalled();
    expect([...page.selectedIds()]).toEqual(['a']);

    page.clearSelection();
    page.toggleSelect(record('x', 'c2', 300));
    expect([...page.selectedIds()]).toEqual(['x']);
    expect(page.selectionClientId()).toBe('c2');
  });

  it('opens the settlement for exactly the selected accounts of that client', () => {
    page.toggleSelect(record('a', 'c1', 500));
    page.toggleSelect(record('b', 'c1', 1000));
    page.openSelectionSettlement();
    expect(page.isSettlementOpen()).toBeTrue();
    expect(page.settlementClientId()).toBe('c1');
    expect(page.settlementAccountIds()).toEqual(['a', 'b']);
  });
});
