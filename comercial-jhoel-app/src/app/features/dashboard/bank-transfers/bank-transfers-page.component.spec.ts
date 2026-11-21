import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';

import { Bank, BankTransfer } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { BankService } from '../../../core/services/bank.service';
import { BankTransferService } from '../../../core/services/bank-transfer.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TransactionBankService } from '../../../core/services/transaction-bank.service';
import { BankTransfersPageComponent, CASH_WITHDRAWAL_VALUE } from './bank-transfers-page.component';

function bank(id: string, name: string, finalBalance: number, extra: Partial<Bank> = {}): Bank {
  return {
    id,
    name,
    accountNumber: `00-${id}`,
    accountTypeId: 't1',
    accountTypeName: 'Monetaria',
    previousBalance: 0,
    finalBalance,
    specialAccount: null,
    maxBalance: null,
    availableInTransaccionar: true,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    ...extra,
  };
}

const ACCOUNTS = [
  bank('bi', 'Banco Industrial', 15250, { specialAccount: 'BANCO_INDUSTRIAL' }),
  bank('gtc', 'GTC', 8500),
  bank('club', 'BI Club Empresarial', 0, { specialAccount: 'BI_CLUB', maxBalance: 75000, accountTypeName: 'Linea Crédito' }),
];

describe('BankTransfersPageComponent — origen y destino con tarjetas', () => {
  let fixture: ComponentFixture<BankTransfersPageComponent>;
  let page: BankTransfersPageComponent;
  let transfers: jasmine.SpyObj<BankTransferService>;
  let pending: Subject<BankTransfer>;

  beforeEach(() => {
    pending = new Subject<BankTransfer>();
    transfers = jasmine.createSpyObj('BankTransferService', ['getTransfers', 'registerTransfer', 'getBalanceCredits']);
    transfers.getTransfers.and.returnValue(of([]));
    transfers.registerTransfer.and.returnValue(pending.asObservable());
    TestBed.configureTestingModule({
      imports: [BankTransfersPageComponent],
      providers: [
        { provide: BankService, useValue: { getBanks: () => of(ACCOUNTS) } },
        { provide: BankTransferService, useValue: transfers },
        { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['success', 'error']) },
        { provide: AuthService, useValue: { isAdmin: signal(false) } },
        { provide: TransactionBankService, useValue: { getTransactionBanks: () => of([]) } },
      ],
    });
    fixture = TestBed.createComponent(BankTransfersPageComponent);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  const el = () => fixture.nativeElement as HTMLElement;

  it('has no dropdowns: origin and destination are card pickers', () => {
    expect(el().querySelector('#panel-transfers select')).toBeNull();
    expect(el().querySelectorAll('app-bank-account-picker').length).toBe(2);
  });

  it('choosing an origin card sets the same source signal the dropdown used', () => {
    const originCards = el().querySelectorAll<HTMLButtonElement>('app-bank-account-picker:first-of-type button.card');
    originCards[1].click();
    fixture.detectChanges();
    expect(page.sourceId()).toBe('gtc');
    expect(page.source()?.name).toBe('GTC');
  });

  it('the origin account is never a valid destination', () => {
    page.onSourceChange('gtc');
    expect(page.destinationBlockedReasons()['gtc']).toBe('Es la cuenta de origen.');
    expect(page.destinationBlockedReasons()['bi']).toBeUndefined();
  });

  it('changing the origin to the chosen destination clears the destination', () => {
    page.onSourceChange('bi');
    page.destinationId.set('gtc');
    page.onSourceChange('gtc');
    expect(page.destinationId()).toBe('');
  });

  it('keeps the special-account rules: BI Club only to Banco Industrial, no cash withdrawal', () => {
    page.onSourceChange('club');
    expect(page.destinationBlockedReasons()['gtc']).toContain('BI Club Empresarial solo puede transferir a Banco Industrial');
    expect(page.destinationBlockedReasons()['bi']).toBeUndefined();
    expect(page.destinationExtras()[0].id).toBe(CASH_WITHDRAWAL_VALUE);
    expect(page.destinationExtras()[0].blockedReason).toBeTruthy();
  });

  it('keeps the balance validation and the summary figures', () => {
    page.onSourceChange('gtc');
    page.destinationId.set('bi');
    page.onAmountChange(9000);
    expect(page.validationError()).toBe('Saldo insuficiente para realizar la transferencia.');
    page.onAmountChange(500);
    expect(page.validationError()).toBeNull();
    expect(page.preview()).toEqual({
      amount: 500,
      sourceBefore: 8500,
      sourceAfter: 8000,
      destinationBefore: 15250,
      destinationAfter: 15750,
    });
  });

  it('selecting cards never sends anything; confirming twice sends only once', () => {
    page.onSourceChange('gtc');
    page.destinationId.set('bi');
    page.onAmountChange(500);
    expect(transfers.registerTransfer).not.toHaveBeenCalled();
    page.requestConfirm();
    expect(page.isConfirmOpen()).toBeTrue();
    page.confirmTransfer();
    page.confirmTransfer();
    expect(transfers.registerTransfer).toHaveBeenCalledTimes(1);
    expect(transfers.registerTransfer.calls.mostRecent().args[0]).toEqual(
      jasmine.objectContaining({ sourceBankId: 'gtc', destinationBankId: 'bi', amount: 500 }),
    );
  });
});
