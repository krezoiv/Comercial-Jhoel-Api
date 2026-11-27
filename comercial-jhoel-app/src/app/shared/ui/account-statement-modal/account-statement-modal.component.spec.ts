import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { KardexAccountService, KardexMovement, KardexStatement, PortfolioRecordTrace } from '../../../core/models';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { AccountStatementModalComponent } from './account-statement-modal.component';

const trace = (over: Partial<PortfolioRecordTrace> = {}): PortfolioRecordTrace => ({
  recordId: 'r',
  isActive: true,
  paymentMethod: 'EFECTIVO',
  cashTracked: true,
  cashEffect: 200,
  kardexNet: 200,
  lock: null,
  operationId: null,
  voided: null,
  movements: [],
  changes: [],
  ...over,
});

const row = (over: Partial<KardexMovement> = {}): KardexMovement => ({
  id: 'r',
  date: '2026-11-26',
  movementType: 'ABONO',
  description: 'Abono',
  amount: 200,
  balanceAfter: 300,
  isActive: true,
  createdByUsername: 'admin',
  createdAt: '2026-11-26T16:00:00Z',
  trace: trace(),
  ...over,
});

const voided = row({
  id: 'v',
  description: 'Abono duplicado',
  balanceAfter: null,
  isActive: false,
  trace: trace({
    recordId: 'v',
    isActive: false,
    cashEffect: 0,
    kardexNet: 0,
    voided: { at: '2026-11-26T18:00:00Z', byUsername: 'admin', reason: 'Abono registrado dos veces' },
    movements: [
      { id: 'm1', sequence: 120, movementType: 'ABONO_POR_COBRAR', direction: 'IN', amount: 150, status: 'ANULADO', reason: null, reversalOfId: null, createdAt: '2026-11-26T16:00:00Z', username: 'admin' },
      { id: 'm2', sequence: 121, movementType: 'ANULACION', direction: 'OUT', amount: 150, status: 'VIGENTE', reason: 'El cliente entregó Q180', reversalOfId: 'm1', createdAt: '2026-11-26T17:00:00Z', username: 'admin' },
    ],
    changes: [
      {
        id: 'c1',
        action: 'MODIFICADO',
        reason: 'El cliente entregó Q180',
        changes: { amount: { from: 150, to: 180 } },
        cashTracked: true,
        cashEffectBefore: 150,
        cashEffectAfter: 180,
        cashMovementIds: ['m2', 'm3'],
        changedByUsername: 'admin',
        changedAt: '2026-11-26T17:00:00Z',
      },
      {
        id: 'c2',
        action: 'ANULADO',
        reason: 'Abono registrado dos veces',
        changes: { isActive: { from: true, to: false } },
        cashTracked: true,
        cashEffectBefore: 180,
        cashEffectAfter: 0,
        cashMovementIds: ['m4'],
        changedByUsername: 'admin',
        changedAt: '2026-11-26T18:00:00Z',
      },
    ],
  }),
});

const statement = (movements: KardexMovement[]): KardexStatement => ({
  clientId: 'client',
  clientName: 'Cliente A',
  openingBalance: 0,
  movements,
  totalCargos: 500,
  totalAbonos: 200,
  closingBalance: 300,
  voidedCount: movements.filter((m) => !m.isActive).length,
});

describe('Estado de cuenta de Cartera (CxC / Activos)', () => {
  let service: jasmine.SpyObj<KardexAccountService>;

  beforeEach(() => {
    service = jasmine.createSpyObj<KardexAccountService>('KardexAccountService', [
      'getStatement',
      'getCurrentBalance',
      'registerCharge',
      'registerPayment',
    ]);
    service.getStatement.and.returnValue(of(statement([row(), voided])));
    service.registerPayment.and.returnValue(of({}));
    TestBed.configureTestingModule({
      imports: [AccountStatementModalComponent],
      providers: [{ provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true) } }],
    });
  });

  function open() {
    const fixture = TestBed.createComponent(AccountStatementModalComponent);
    fixture.componentRef.setInput('service', service);
    fixture.componentRef.setInput('client', { id: 'client', name: 'Cliente A' });
    fixture.componentRef.setInput('canManage', true);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    return fixture;
  }

  it('keeps a voided row in place, with who, when and why — it no longer counts', () => {
    const fixture = open();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Anulado');
    expect(text).toContain('Abono registrado dos veces');
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('tr.row--voided').length).toBe(1);
    expect(text).toMatch(/Mostrar anulados\s+\(1\)/);
    const modal = fixture.componentInstance;
    expect(modal.cashLabel(row())).toBe('Efectivo · Entrada de Q 200.00');
    expect(modal.cashLabel(voided)).toBe('Efectivo · revertido en Caja');
    expect(modal.cashLabel(row({ trace: trace({ paymentMethod: 'BANCO', cashEffect: 0, kardexNet: 0 }) }))).toBe(
      'Banco · no mueve Caja',
    );
    expect(modal.cashLabel(row({ trace: trace({ cashTracked: false, cashEffect: null }) }))).toBe(
      'Anterior al Control de Efectivo',
    );
  });

  it('shows the change history: before → after, reason, user and the Caja movements', () => {
    const fixture = open();
    fixture.componentInstance.toggleHistory('v');
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Monto: Q 150.00 → Q 180.00');
    expect(text).toContain('El cliente entregó Q180');
    expect(text).toContain('Caja: Entrada de Q 150.00 → Entrada de Q 180.00 (2 movimiento(s) en el Kardex).');
    expect(text).toContain('MOV-000121 reversa −Q 150.00');
  });

  it('hides voided rows through the backend, and registers an abono by bank with its method', async () => {
    const fixture = open();
    const modal = fixture.componentInstance;
    modal.onShowVoidedChange(false);
    expect(service.getStatement.calls.mostRecent().args[1]).toEqual(jasmine.objectContaining({ includeVoided: false }));

    modal.openMovementForm('ABONO');
    modal.form.patchValue({ amount: 100, paymentMethod: 'BANCO' });
    await modal.submitMovement();
    expect(service.registerPayment).toHaveBeenCalledWith('client', jasmine.objectContaining({ amount: 100, paymentMethod: 'BANCO' }));
  });
});
