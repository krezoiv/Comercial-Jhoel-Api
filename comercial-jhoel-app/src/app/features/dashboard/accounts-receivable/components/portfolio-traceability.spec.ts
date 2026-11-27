import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AccountReceivable, PortfolioRecordTrace } from '../../../../core/models';
import { AccountReceivableService } from '../../../../core/services/account-receivable.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { AccountReceivableFormModalComponent } from './account-receivable-form-modal/account-receivable-form-modal.component';
import { DeleteConfirmModalComponent } from './delete-confirm-modal/delete-confirm-modal.component';

const RECORD: AccountReceivable = {
  id: 'r-1',
  clientId: 'client',
  clientName: 'Cliente A',
  date: '2026-11-26',
  amount: 150,
  movementType: 'ABONO',
  description: 'Abono',
  paymentMethod: 'EFECTIVO',
  isActive: true,
  createdAt: '2026-11-26T16:00:00Z',
  updatedAt: '2026-11-26T16:00:00Z',
  createdByUsername: 'admin',
  updatedByUsername: null,
};

const trace = (over: Partial<PortfolioRecordTrace> = {}): PortfolioRecordTrace => ({
  recordId: 'r-1',
  isActive: true,
  paymentMethod: 'EFECTIVO',
  cashTracked: true,
  cashEffect: 150,
  kardexNet: 150,
  lock: null,
  operationId: null,
  voided: null,
  movements: [],
  changes: [],
  ...over,
});

describe('Cuentas por Cobrar ↔ Caja (anular y editar)', () => {
  let service: AccountReceivableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeleteConfirmModalComponent, AccountReceivableFormModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true) } },
      ],
    });
    service = TestBed.inject(AccountReceivableService);
  });

  it('voiding asks for the reason and says what Caja will register (from the backend trace)', () => {
    spyOn(service, 'getTrace').and.returnValue(of(trace()));
    const fixture = TestBed.createComponent(DeleteConfirmModalComponent);
    fixture.componentRef.setInput('record', RECORD);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    const modal = fixture.componentInstance;
    const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text()).toContain('Caja registra la reversa: salida de Q 150.00');
    expect(modal.movesCash()).toBeTrue();

    const emitted: string[] = [];
    modal.confirmed.subscribe((reason) => emitted.push(reason));
    modal.reason.set('no');
    modal.confirm();
    expect(emitted).toEqual([]);
    modal.reason.set('  Abono   registrado dos veces ');
    modal.confirm();
    expect(emitted).toEqual(['Abono registrado dos veces']);
  });

  it('a record paid by bank or from before Control de Efectivo: voiding does not move Caja', () => {
    const getTrace = spyOn(service, 'getTrace').and.returnValue(of(trace({ paymentMethod: 'BANCO', cashEffect: 0, kardexNet: 0 })));
    const fixture = TestBed.createComponent(DeleteConfirmModalComponent);
    fixture.componentRef.setInput('record', RECORD);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(fixture.componentInstance.cashNote()).toBe('Se registró por banco: anularlo no mueve Caja.');

    getTrace.and.returnValue(of(trace({ cashTracked: false, cashEffect: null, kardexNet: 0 })));
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(fixture.componentInstance.cashNote()).toContain('anterior al Control de Efectivo');
  });

  it('editing the amount requires a reason and sends it with the payment method', async () => {
    spyOn(service, 'getTrace').and.returnValue(of(trace()));
    const update = spyOn(service, 'updateAccountReceivable').and.returnValue(of(RECORD));
    const fixture = TestBed.createComponent(AccountReceivableFormModalComponent);
    fixture.componentRef.setInput('record', RECORD);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    const form = fixture.componentInstance;

    form.form.controls.description.setValue('Abono semanal');
    expect(form.needsReason()).toBeFalse();
    expect(form.cashNote()).toContain('Cambiar fecha, cliente o descripción no mueve Caja');

    form.form.controls.amount.setValue(180);
    expect(form.needsReason()).toBeTrue();
    expect(form.cashNote()).toContain('Caja registrará la reversa del movimiento vigente (entrada de Q 150.00)');
    await form.submit();
    expect(update).not.toHaveBeenCalled();

    form.form.controls.reason.setValue('El cliente entregó Q180');
    await form.submit();
    expect(update).toHaveBeenCalledWith(
      'r-1',
      jasmine.objectContaining({ amount: 180, paymentMethod: 'EFECTIVO', reason: 'El cliente entregó Q180' }),
    );
  });

  it('a cargo born in Transaccionar: amount, client and method are locked', () => {
    spyOn(service, 'getTrace').and.returnValue(of(trace({ lock: 'BANK_DEPOSIT', operationId: 'op-1' })));
    const fixture = TestBed.createComponent(AccountReceivableFormModalComponent);
    fixture.componentRef.setInput('record', { ...RECORD, movementType: 'CARGO' });
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    const form = fixture.componentInstance.form;
    expect([form.controls.amount.disabled, form.controls.paymentMethod.disabled, form.controls.clientId.disabled]).toEqual([
      true,
      true,
      true,
    ]);
    expect(form.controls.description.enabled).toBeTrue();
    expect(fixture.componentInstance.cashNote()).toContain('Nació de una operación de Transaccionar');
  });
});
