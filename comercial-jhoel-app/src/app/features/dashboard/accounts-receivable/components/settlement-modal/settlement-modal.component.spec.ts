import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { SettlementPreview, SettlementPreviewInput, SettlementResult } from '../../../../../core/models';
import { AccountReceivablePaymentService } from '../../../../../core/services/account-receivable-payment.service';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { SettlementModalComponent } from './settlement-modal.component';

function line(id: string, pending: number) {
  return {
    id,
    clientId: 'c1',
    clientName: 'Cliente A',
    date: '2026-11-10',
    description: `Cuenta ${id}`,
    originalAmount: pending,
    paidAmount: 0,
    pendingAmount: pending,
    status: 'PENDIENTE' as const,
    createdAt: '2026-11-10T00:00:00Z',
    amountToPay: pending,
    pendingAfter: 0,
  };
}

/** Fake backend preview: totals are whatever the "server" computes, never the component. */
function fakePreview(input: SettlementPreviewInput): SettlementPreview {
  const lines = [line('a', 500), line('b', 1000), line('c', 750)].filter((row) =>
    input.items.some((item) => item.accountReceivableId === row.id),
  );
  const total = lines.reduce((sum, row) => sum + row.pendingAmount, 0);
  return {
    clientId: 'c1',
    clientName: 'Cliente A',
    paymentMethod: input.paymentMethod,
    lines,
    total,
    cash: input.paymentMethod === 'EFECTIVO' ? { current: 150000, after: 150000 + total } : null,
    bank:
      input.paymentMethod === 'DEPOSITO_BANCARIO'
        ? { id: 'b1', name: 'Banco Industrial', accountNumber: '123', current: 50000, after: 50000 + total }
        : null,
  };
}

describe('SettlementModalComponent (cancelación de cuentas por cobrar)', () => {
  let component: SettlementModalComponent;
  let previewSpy: jasmine.Spy;
  let settleSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SettlementModalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(AccountReceivablePaymentService);
    const cash = TestBed.inject(CashControlService);
    spyOn(cash, 'getBankBalances').and.returnValue(
      of([
        { bankId: 'b1', bankName: 'Banco Industrial', accountNumber: '123', specialAccount: 'BANCO_INDUSTRIAL', balance: 50000 },
        { bankId: 'g', bankName: 'Cooperativa Guayacán', accountNumber: null, specialAccount: 'GUAYACAN', balance: 0 },
      ]),
    );
    previewSpy = spyOn(service, 'preview').and.callFake((input) => of(fakePreview(input)));
    settleSpy = spyOn(service, 'settle').and.returnValue(
      of({ operation: { id: 'op1', paymentMethod: 'EFECTIVO', totalAmount: 2250, details: [] }, cashBalance: 152250 } as unknown as SettlementResult),
    );
    component = TestBed.createComponent(SettlementModalComponent).componentInstance;
    component.open = true;
    component.clientId = 'c1';
    component.clientName = 'Cliente A';
    component.accountIds = ['a', 'b', 'c'];
  });

  it('shows the backend total and requires choosing how the payment was received', fakeAsync(() => {
    component.ngOnChanges();
    tick(300);
    expect(component.preview()?.total).toBe(2250);
    expect(component.method()).toBeNull();
    expect(component.canContinue()).toBeFalse();

    component.selectMethod('EFECTIVO');
    tick(300);
    expect(component.preview()?.cash).toEqual({ current: 150000, after: 152250 });
    expect(component.canContinue()).toBeTrue();
  }));

  it('never offers the Guayacán account and needs a bank for a deposit (cash unchanged)', fakeAsync(() => {
    component.ngOnChanges();
    component.selectMethod('DEPOSITO_BANCARIO');
    tick(300);
    expect(component.banks().map((bank) => bank.bankId)).toEqual(['b1']);
    expect(component.canContinue()).toBeFalse();

    component.onBankChange('b1');
    tick(300);
    expect(component.preview()?.bank?.after).toBe(52250);
    expect(component.preview()?.cash).toBeNull();
    expect(component.previewReady()).toBeTrue();
  }));

  it('sends the confirmed total and one request id; a retry reuses it (no duplicate payment)', fakeAsync(() => {
    component.ngOnChanges();
    component.selectMethod('EFECTIVO');
    tick(300);
    component.goToConfirm();
    expect(component.step()).toBe('confirm');

    component.confirm();
    component.confirm();
    const [first] = settleSpy.calls.argsFor(0);
    const [second] = settleSpy.calls.argsFor(1);
    expect(first).toEqual(
      jasmine.objectContaining({ clientId: 'c1', paymentMethod: 'EFECTIVO', expectedTotal: 2250, bankId: undefined }),
    );
    expect(first.items).toEqual([{ accountReceivableId: 'a' }, { accountReceivableId: 'b' }, { accountReceivableId: 'c' }]);
    expect(second.clientRequestId).toBe(first.clientRequestId);
  }));

  it('allows a partial amount only for a single account', fakeAsync(() => {
    component.accountIds = ['b'];
    component.ngOnChanges();
    tick(300);
    expect(component.isSingle()).toBeTrue();
    component.onPartialChange(1200);
    expect(component.partialInvalid()).toBeTrue();
    component.onPartialChange(400);
    tick(300);
    expect(component.partialInvalid()).toBeFalse();
    const last = previewSpy.calls.mostRecent().args[0] as SettlementPreviewInput;
    expect(last.items).toEqual([{ accountReceivableId: 'b', amount: 400 }]);
  }));
});
