import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { GuayacanCashMovementDetail } from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { GuayacanCashBoxService } from '../../../../../core/services/guayacan-cash-box.service';
import { GuayacanMovementFormModalComponent, GuayacanMovementFormMode } from './movement-form-modal.component';

describe('GuayacanMovementFormModalComponent', () => {
  let component: GuayacanMovementFormModalComponent;
  let service: jasmine.SpyObj<GuayacanCashBoxService>;
  let confirm: jasmine.SpyObj<ConfirmDialogService>;
  let saved: GuayacanCashMovementDetail[];

  function open(mode: GuayacanMovementFormMode, balance: number, suggested: number | null = null): void {
    const fixture = TestBed.createComponent(GuayacanMovementFormModalComponent);
    component = fixture.componentInstance;
    saved = [];
    component.saved.subscribe((movement) => saved.push(movement));
    fixture.componentRef.setInput('mode', mode);
    fixture.componentRef.setInput('currentBalance', balance);
    fixture.componentRef.setInput('suggestedAmount', suggested);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  }

  beforeEach(() => {
    service = jasmine.createSpyObj<GuayacanCashBoxService>('GuayacanCashBoxService', ['registerMovement', 'registerAdjustment']);
    service.registerMovement.and.returnValue(of({ id: 'mov-1' } as GuayacanCashMovementDetail));
    service.registerAdjustment.and.returnValue(of({ id: 'adj-1' } as GuayacanCashMovementDetail));
    confirm = jasmine.createSpyObj<ConfirmDialogService>('ConfirmDialogService', ['confirm']);
    confirm.confirm.and.resolveTo(true);
    TestBed.configureTestingModule({
      imports: [GuayacanMovementFormModalComponent],
      providers: [
        { provide: GuayacanCashBoxService, useValue: service },
        { provide: ConfirmDialogService, useValue: confirm },
      ],
    });
  });

  it('ingreso Q500 over Q2,000 previews Q2,500', () => {
    open('INGRESO', 2000);
    component.onAmountChange(500);
    expect(component.balanceAfter()).toBe(2500);
  });

  it('egreso Q300 over Q2,500 previews Q2,200', () => {
    open('EGRESO', 2500);
    component.onAmountChange(300);
    expect(component.signedAmount()).toBe(-300);
    expect(component.balanceAfter()).toBe(2200);
  });

  it('blocks an egreso larger than the cash available', async () => {
    open('EGRESO', 100);
    component.onAmountChange(150);
    component.concept.set('Retiro de efectivo');

    expect(component.validationError()).toContain('supera el efectivo disponible');
    await component.submit();
    expect(service.registerMovement).not.toHaveBeenCalled();
  });

  it('blocks zero amount and a missing concept', () => {
    open('INGRESO', 0);
    expect(component.validationError()).toContain('mayor que cero');
    component.onAmountChange(10);
    expect(component.validationError()).toContain('concepto');
  });

  it('asks for confirmation and sends the payload (no breakdown)', async () => {
    open('INGRESO', 0);
    component.onAmountChange(500);
    component.concept.set('  Fondo de caja ');

    await component.submit();

    expect(confirm.confirm).toHaveBeenCalled();
    const payload = service.registerMovement.calls.mostRecent().args[0];
    expect(payload).toEqual(
      jasmine.objectContaining({ movementType: 'INGRESO', amount: 500, concept: 'Fondo de caja', cashDetails: [] }),
    );
    expect(saved.length).toBe(1);
  });

  it('does nothing if the confirmation is cancelled', async () => {
    confirm.confirm.and.resolveTo(false);
    open('INGRESO', 0);
    component.onAmountChange(10);
    component.concept.set('Prueba');

    await component.submit();

    expect(service.registerMovement).not.toHaveBeenCalled();
  });

  it('requires the breakdown to match when it is used, and sends it', async () => {
    open('INGRESO', 0);
    component.onAmountChange(250);
    component.concept.set('Con desglose');
    component.toggleBreakdown();
    component.onQuantityChange({ denomination: 200, quantity: 1 });
    expect(component.validationError()).toContain('desglose');

    component.onQuantityChange({ denomination: 50, quantity: 1 });
    expect(component.validationError()).toBeNull();
    await component.submit();

    expect(service.registerMovement.calls.mostRecent().args[0].cashDetails).toEqual([
      { denomination: 200, quantity: 1 },
      { denomination: 50, quantity: 1 },
    ]);
  });

  it('a retry after a failure reuses the same request id (no double movement)', async () => {
    service.registerMovement.and.returnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
    open('INGRESO', 0);
    component.onAmountChange(20);
    component.concept.set('Reintento');

    await component.submit();
    await component.submit();

    const [first, second] = service.registerMovement.calls.all().map((call) => call.args[0].clientRequestId);
    expect(first).toBe(second);
    expect(component.errorMessage()).not.toBeNull();
  });

  it('a new opening gets a new request id', async () => {
    open('INGRESO', 0);
    component.onAmountChange(5);
    component.concept.set('Primero');
    await component.submit();
    const first = service.registerMovement.calls.mostRecent().args[0].clientRequestId;

    open('INGRESO', 0);
    component.onAmountChange(5);
    component.concept.set('Segundo');
    await component.submit();

    expect(service.registerMovement.calls.mostRecent().args[0].clientRequestId).not.toBe(first);
  });

  it('ajuste from an arqueo: signed amount and a mandatory reason', async () => {
    open('AJUSTE', 100, -0.5);
    expect(component.signedAmount()).toBe(-0.5);
    expect(component.validationError()).toContain('motivo');

    component.reason.set('Faltante en conteo físico');
    await component.submit();

    expect(service.registerAdjustment.calls.mostRecent().args[0]).toEqual(
      jasmine.objectContaining({ amount: -0.5, reason: 'Faltante en conteo físico' }),
    );
  });
});
