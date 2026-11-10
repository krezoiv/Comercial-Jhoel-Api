import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CashMovementResult } from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { CashBankDepositModalComponent } from './cash-bank-deposit-modal.component';

describe('CashBankDepositModalComponent (depósito bancario con desglose)', () => {
  let component: CashBankDepositModalComponent;
  let service: CashControlService;
  let registerSpy: jasmine.Spy;

  beforeEach(() => {
    const confirm = jasmine.createSpyObj<ConfirmDialogService>('ConfirmDialogService', ['confirm']);
    confirm.confirm.and.resolveTo(true);
    TestBed.configureTestingModule({
      imports: [CashBankDepositModalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: ConfirmDialogService, useValue: confirm }],
    });
    service = TestBed.inject(CashControlService);
    spyOn(service, 'getBankBalances').and.returnValue(
      of([
        { bankId: 'b1', bankName: 'Banco Industrial', accountNumber: '123', specialAccount: 'BANCO_INDUSTRIAL', balance: 5000 },
        { bankId: 'g', bankName: 'Cooperativa Guayacán', accountNumber: null, specialAccount: 'GUAYACAN', balance: 10 },
      ]),
    );
    registerSpy = spyOn(service, 'registerBankDeposit').and.returnValue(
      of({ movement: { id: 'm1' }, balance: 9000 } as unknown as CashMovementResult),
    );
    const fixture = TestBed.createComponent(CashBankDepositModalComponent);
    component = fixture.componentInstance;
    component.open = true;
    component.currentBalance = 10000;
    component.ngOnChanges();
  });

  it('never offers the Guayacán account (its balance is its own caja)', () => {
    expect(component.banks().map((bank) => bank.bankId)).toEqual(['b1']);
  });

  it('enables saving only when the breakdown matches the amount exactly', () => {
    component.bankId.set('b1');
    component.amount.set(1000);
    component.onQuantityChange({ denomination: 200, quantity: 4 });
    expect(component.breakdownStatus()).toBe('yellow');
    expect(component.canSave()).toBeFalse();

    component.onQuantityChange({ denomination: 100, quantity: 2 });
    expect(component.breakdownStatus()).toBe('green');
    expect(component.canSave()).toBeTrue();

    component.onQuantityChange({ denomination: 100, quantity: 3 });
    expect(component.breakdownStatus()).toBe('red');
    expect(component.canSave()).toBeFalse();
  });

  it('previews cash down and bank up, and blocks amounts above the cash available', () => {
    component.bankId.set('b1');
    component.amount.set(1000);
    expect(component.cashAfter()).toBe(9000);
    expect(component.bankAfter()).toBe(6000);
    component.amount.set(10001);
    expect(component.insufficientCash()).toBeTrue();
  });

  it('sends the account, amount and only the counted denominations', async () => {
    component.bankId.set('b1');
    component.amount.set(1000);
    component.onQuantityChange({ denomination: 200, quantity: 5 });
    component.description.set('  Boleta 99 ');

    await component.save();

    const payload = registerSpy.calls.mostRecent().args[0];
    expect(payload).toEqual(
      jasmine.objectContaining({ bankId: 'b1', amount: 1000, details: [{ denomination: 200, quantity: 5 }], description: 'Boleta 99' }),
    );
    expect(payload.clientRequestId).toBeTruthy();
  });
});
