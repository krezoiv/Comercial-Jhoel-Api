import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TransactionBank } from '../models';
import { BankLogoService } from './bank-logo.service';
import { TransactionBankService } from './transaction-bank.service';

function agent(name: string, hasImage: boolean): TransactionBank {
  return {
    id: `id-${name}`,
    name,
    isActive: true,
    hasImage,
    cashBoxCode: null,
    commissionPerTransaction: null,
    createdAt: '',
    updatedAt: '2026-11-20T00:00:00Z',
  };
}

describe('BankLogoService — logos de las cuentas', () => {
  let service: BankLogoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TransactionBankService,
          useValue: { getTransactionBanks: () => of([agent('Banco Industrial', true), agent('GTC', false)]) },
        },
      ],
    });
    service = TestBed.inject(BankLogoService);
  });

  it('reuses the logo uploaded for the Banco Agente of that account', () => {
    const visual = service.visualFor({ name: 'Banco Industrial', specialAccount: 'BANCO_INDUSTRIAL' });
    expect(visual.imageUrl).toContain('id-Banco Industrial');
    expect(visual.monogram).toBe('BI');
  });

  it('without an uploaded logo: the monogram on a neutral tone, never an invented logo', () => {
    const gtc = service.visualFor({ name: 'GTC', specialAccount: null });
    expect(gtc.imageUrl).toBeNull();
    expect(gtc.monogram).toBe('GTC');
    const other = service.visualFor({ name: 'Banco Promérica', specialAccount: null });
    expect(other.imageUrl).toBeNull();
    expect(other.monogram).toBe('P');
    expect(other.tone).toMatch(/^#[0-9a-f]{6}$/);
  });
});
