import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { PaymentGroup, PaymentGroupDetail, PaymentGroupItem } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { CashControlService } from '../../../core/services/cash-control.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { PaymentGroupService } from '../../../core/services/payment-group.service';
import { GroupItemActionModalComponent } from './components/group-item-action-modal/group-item-action-modal.component';
import { PaymentGroupCreateFormComponent } from './components/payment-group-create-form/payment-group-create-form.component';
import { PaymentGroupDetailPageComponent } from './payment-group-detail-page.component';

const group = (over: Partial<PaymentGroup> = {}): PaymentGroup =>
  ({
    id: 'g-1',
    code: 'PG-000001',
    number: 1,
    transactionTypeId: 't-1',
    transactionTypeName: 'Pago Varios',
    cashDirection: 'OUT',
    description: 'Pagos varios del día',
    operationDate: '2026-11-26',
    transactionBankId: 'a-1',
    transactionBankName: 'BI',
    authorizedAmount: 5000,
    lifecycle: 'ABIERTO',
    status: 'PARCIAL',
    itemCount: 3,
    paidCount: 1,
    partialCount: 1,
    noPaymentCount: 0,
    pendingCount: 1,
    voidedCount: 0,
    unresolvedCount: 1,
    paidAmount: 800,
    outstandingAmount: 700,
    releasedAmount: 0,
    reservedAmount: 4200,
    createdByUsername: 'cajero',
    ...over,
  }) as PaymentGroup;

const item = (over: Partial<PaymentGroupItem> = {}): PaymentGroupItem => ({
  id: 'i-1',
  itemNumber: 1,
  expectedAmount: 500,
  paidAmount: 0,
  outstandingAmount: 500,
  releasedAmount: 0,
  reference: 'Juan Pérez',
  status: 'PENDIENTE',
  deliveryCount: 0,
  lastPaidAt: null,
  noPaymentAt: null,
  resolution: null,
  resolvedAt: null,
  resolvedByUsername: null,
  voidedAt: null,
  voidReason: null,
  operations: [],
  ...over,
});

const detail = (): PaymentGroupDetail => ({
  group: group(),
  items: [
    item({ id: 'i-1', itemNumber: 1, status: 'PAGADO', paidAmount: 500, outstandingAmount: 0, operations: [{ operationId: 'o-1', amount: 500, movementNumber: 'MOV-000101', isVoided: false, createdAt: '', username: 'cajero' }] }),
    item({ id: 'i-2', itemNumber: 2, status: 'PARCIAL', paidAmount: 300, outstandingAmount: 200 }),
    item({ id: 'i-3', itemNumber: 3, status: 'PENDIENTE' }),
  ],
  cash: { balance: 10000, reserved: 4200, available: 5800 },
  closeCheck: { canClose: false, pendingCount: 1, unresolvedCount: 1, releaseOnClose: 4200 },
});

describe('Pagos grupales (pantallas)', () => {
  let service: PaymentGroupService;
  let isAdmin = false;

  beforeEach(() => {
    isAdmin = false;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true) } },
        { provide: AuthService, useValue: { isAdmin: () => isAdmin, currentUser: () => ({ id: 'u-1' }) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'g-1' }), queryParamMap: convertToParamMap({}) } } },
      ],
    });
    service = TestBed.inject(PaymentGroupService);
    spyOn(TestBed.inject(CashControlService), 'getBalance').and.returnValue(
      of({ balance: 10000, lastSequence: 9, lastMovementAt: null, reserved: 0, available: 10000 }),
    );
  });

  it('create form: N transactions with their own amounts, reservation preview, one idempotent request', async () => {
    const create = spyOn(service, 'create').and.returnValue(of(detail()));
    const fixture = TestBed.createComponent(PaymentGroupCreateFormComponent);
    fixture.componentRef.setInput('transactionTypeId', 't-1');
    fixture.componentRef.setInput('transactionTypeName', 'Pago Varios');
    fixture.componentRef.setInput('cashEffect', 'OUT');
    fixture.componentRef.setInput('transactionBanks', [{ id: 'a-1', name: 'BI', isActive: true, cashBoxCode: null }]);
    fixture.detectChanges();
    const form = fixture.componentInstance;

    form.description.set('Pagos varios del día');
    form.agentId.set('a-1');
    form.onCountChange(3);
    form.authorized.set(1000);
    form.splitEqually();
    expect(form.items().map((i) => i.expectedAmount)).toEqual([333.33, 333.33, 333.34]);
    form.updateItem(2, { expectedAmount: 500 });
    expect(form.problems()).toContain('La suma de las transacciones supera el monto autorizado.');
    form.updateItem(0, { expectedAmount: 200 });
    form.updateItem(1, { expectedAmount: 300 });
    expect(form.problems()).toEqual([]);
    expect(form.availableAfter()).toBe(9000);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Disponible después de reservar');

    await form.save();
    expect(create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        transactionTypeId: 't-1',
        transactionBankId: 'a-1',
        authorizedAmount: 1000,
        items: [{ expectedAmount: 200, reference: undefined }, { expectedAmount: 300, reference: undefined }, { expectedAmount: 500, reference: undefined }],
        clientRequestId: jasmine.any(String),
      }),
    );
  });

  it('confirmation modal: shows the Caja facts and sends the amount with its request id', () => {
    const deliver = spyOn(service, 'deliver').and.returnValue(of(detail()));
    const fixture = TestBed.createComponent(GroupItemActionModalComponent);
    const modal = fixture.componentInstance;
    fixture.componentRef.setInput('group', group());
    fixture.componentRef.setInput('item', item({ id: 'i-2', itemNumber: 2, status: 'PARCIAL', paidAmount: 300, outstandingAmount: 200 }));
    fixture.componentRef.setInput('cash', { balance: 10000, reserved: 4200, available: 5800 });
    fixture.componentRef.setInput('action', 'PARTIAL');
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    modal.amount.set(250);
    expect(modal.canSave()).toBeFalse();
    modal.amount.set(150);
    expect([modal.canSave(), modal.difference(), modal.resultStatus(), modal.projected()]).toEqual([true, 50, 'PARCIAL', 9850]);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Salida real de Caja');
    expect(text).toContain('solo es definitivo cuando el sistema confirma');

    modal.save();
    expect(deliver).toHaveBeenCalledWith('g-1', 'i-2', jasmine.objectContaining({ amount: 150, clientRequestId: jasmine.any(String) }));
  });

  it('voiding a paid transaction requires that the money really came back', () => {
    const fixture = TestBed.createComponent(GroupItemActionModalComponent);
    const modal = fixture.componentInstance;
    fixture.componentRef.setInput('group', group());
    fixture.componentRef.setInput('item', item({ status: 'PAGADO', paidAmount: 500, outstandingAmount: 0 }));
    fixture.componentRef.setInput('action', 'VOID');
    fixture.componentRef.setInput('isAdmin', true);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    modal.text.set('Pago duplicado');
    expect(modal.canSave()).toBeFalse();
    modal.moneyReturned.set(true);
    expect(modal.canSave()).toBeTrue();
  });

  it('detail: financial panel from the backend and actions by status and role', () => {
    spyOn(service, 'get').and.returnValue(of(detail()));
    const fixture = TestBed.createComponent(PaymentGroupDetailPageComponent);
    fixture.detectChanges();
    const page = fixture.componentInstance;
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Todavía reservado');
    expect(text).toContain('Q 4,200.00');
    expect(text).toContain('Disponible para otras operaciones');
    expect(text).toContain('MOV-000101');
    const [paid, partial, pending] = detail().items;
    expect([page.canPay(paid), page.canPay(partial), page.canPay(pending)]).toEqual([false, true, true]);
    expect([page.canResolve(partial), page.canEdit(pending), page.canEdit(paid)]).toEqual([true, true, false]);
    expect(text).not.toContain('Cerrar grupo');
  });
});
