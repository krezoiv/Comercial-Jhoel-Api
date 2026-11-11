import { TestBed } from '@angular/core/testing';

import { CorrectionRequest } from '../../../../../core/models';
import {
  CorrectionModalComponent,
  CorrectionSubmission,
} from './correction-modal.component';

const snapshot: CorrectionRequest = {
  kind: 'SNAPSHOT',
  target: 'BANK_BALANCE',
  targetId: 'bb1',
  field: 'final_balance',
  module: 'BANCOS',
  label: 'Banco Industrial — saldo final registrado',
  originalValue: 120000,
  allowNegative: true,
};

const movement: CorrectionRequest = {
  kind: 'MOVEMENT',
  source: 'ACCOUNT_RECEIVABLE',
  sourceId: 'ar1',
  module: 'CUENTAS_POR_COBRAR',
  label: 'CARGO — Cliente',
  originalValue: 500,
  allowNegative: false,
};

describe('CorrectionModalComponent (corrección de un dato histórico)', () => {
  let modal: CorrectionModalComponent;
  let emitted: CorrectionSubmission[];

  function openWith(request: CorrectionRequest) {
    modal.open = true;
    modal.request = request;
    modal.ngOnChanges({ open: { currentValue: true } as never });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CorrectionModalComponent] });
    modal = TestBed.createComponent(CorrectionModalComponent).componentInstance;
    emitted = [];
    modal.confirmed.subscribe((s) => emitted.push(s));
  });

  it('requires a different corrected value and a reason before showing the comparison', () => {
    openWith(snapshot);
    expect(modal.canContinue).toBeFalse();
    modal.onValueChange(120000);
    modal.reason.set('Saldo mal digitado');
    expect(modal.canContinue).toBeFalse(); // same value = no change
    modal.onValueChange('125000');
    expect(modal.canContinue).toBeTrue();
    modal.goToConfirm();
    expect(modal.step()).toBe('confirm');
    expect(modal.difference()).toBe(5000);
  });

  it('never saves silently: confirm only works from the comparison step', () => {
    openWith(snapshot);
    modal.onValueChange(125000);
    modal.reason.set('Saldo mal digitado');
    modal.confirm();
    expect(emitted.length).toBe(0);
    modal.goToConfirm();
    modal.confirm();
    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual(
      jasmine.objectContaining({
        newValue: 125000,
        reason: 'Saldo mal digitado',
      }),
    );
  });

  it('keeps one request id per opening (a retry cannot duplicate the correction)', () => {
    openWith(snapshot);
    modal.onValueChange(125000);
    modal.reason.set('Saldo mal digitado');
    modal.goToConfirm();
    modal.confirm();
    modal.confirm();
    expect(emitted[0].requestId).toBe(emitted[1].requestId);
    openWith(snapshot);
    modal.onValueChange(1);
    modal.reason.set('Otra corrección');
    modal.goToConfirm();
    modal.confirm();
    expect(emitted[2].requestId).not.toBe(emitted[0].requestId);
  });

  it('rejects a negative amount for a movement and returns to the form on a backend error', () => {
    openWith(movement);
    modal.onValueChange(-5);
    modal.reason.set('Monto real');
    expect(modal.valueInvalid).toBeTrue();
    modal.onValueChange(450);
    modal.goToConfirm();
    modal.error = 'El registro pertenece a otro día.';
    modal.ngOnChanges({ error: { currentValue: modal.error } as never });
    expect(modal.step()).toBe('form');
    expect(modal.newValue()).toBe(450);
  });

  it('cannot be dismissed while saving', () => {
    let cancelled = false;
    modal.cancelled.subscribe(() => (cancelled = true));
    openWith(snapshot);
    modal.isSaving = true;
    modal.onCancel();
    expect(cancelled).toBeFalse();
  });
});
