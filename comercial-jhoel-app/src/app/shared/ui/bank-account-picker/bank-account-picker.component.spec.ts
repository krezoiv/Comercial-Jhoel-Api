import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Bank } from '../../../core/models';
import { TransactionBankService } from '../../../core/services/transaction-bank.service';
import { BankAccountPickerComponent } from './bank-account-picker.component';

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

describe('BankAccountPickerComponent — selección visual de cuentas', () => {
  let fixture: ComponentFixture<BankAccountPickerComponent>;
  let picker: BankAccountPickerComponent;
  let emitted: string[];
  const accounts = [bank('a', 'Banco Industrial', 15250), bank('b', 'GTC', 8500), bank('c', 'Nexa', 0)];

  const el = () => fixture.nativeElement as HTMLElement;
  const cards = () => Array.from(el().querySelectorAll<HTMLButtonElement>('button.card'));

  function render(inputs: Record<string, unknown> = {}): void {
    fixture.componentRef.setInput('heading', 'Cuenta de origen');
    fixture.componentRef.setInput('accounts', accounts);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankAccountPickerComponent],
      providers: [{ provide: TransactionBankService, useValue: { getTransactionBanks: () => of([]) } }],
    });
    fixture = TestBed.createComponent(BankAccountPickerComponent);
    picker = fixture.componentInstance;
    emitted = [];
    picker.selectedChange.subscribe((id) => emitted.push(id));
  });

  it('shows one card per account with its name, type, number and balance (no dropdown)', () => {
    render();
    expect(el().querySelector('select')).toBeNull();
    expect(cards().length).toBe(3);
    const first = cards()[0].textContent ?? '';
    expect(first).toContain('Banco Industrial');
    expect(first).toContain('Monetaria');
    expect(first).toContain('00-a');
    expect(first).toContain('15,250.00');
  });

  it('clicking a card emits its id and marks it as the selected radio', () => {
    render();
    cards()[1].click();
    expect(emitted).toEqual(['b']);
    fixture.componentRef.setInput('selectedId', 'b');
    fixture.detectChanges();
    expect(cards()[1].getAttribute('aria-checked')).toBe('true');
    expect(cards()[1].classList).toContain('card--selected');
    expect(cards()[1].querySelector('.check')).not.toBeNull();
    expect(cards()[0].getAttribute('aria-checked')).toBe('false');
  });

  it('a blocked account is disabled, shows the reason and is never emitted', () => {
    render({ blockedReasons: { a: 'Es la cuenta de origen.' } });
    expect(cards()[0].disabled).toBeTrue();
    expect(cards()[0].textContent).toContain('Es la cuenta de origen.');
    picker.choose('a', 'Es la cuenta de origen.');
    expect(emitted).toEqual([]);
  });

  it('while locked it shows the message and no cards', () => {
    render({ disabled: true, disabledMessage: 'Elija primero la cuenta de origen.' });
    expect(cards().length).toBe(0);
    expect(el().textContent).toContain('Elija primero la cuenta de origen.');
  });

  it('collapses to the chosen account with "Cambiar", and opens again on demand', () => {
    render({ collapsible: true });
    cards()[0].click();
    fixture.componentRef.setInput('selectedId', 'a');
    fixture.detectChanges();
    expect(picker.collapsed()).toBeTrue();
    expect(cards().length).toBe(0);
    expect(el().querySelector('.card--chosen')?.textContent).toContain('Banco Industrial');
    (el().querySelector('.picker__change') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(cards().length).toBe(3);
  });

  it('extra options (cash withdrawal) are cards too, blocked with their reason', () => {
    render({
      extraOptions: [{ id: 'cash', title: 'Retiro de efectivo en banco', subtitle: 'x', icon: 'wallet', blockedReason: 'No permitido' }],
    });
    const extra = el().querySelector<HTMLButtonElement>('button.card--extra')!;
    expect(extra.textContent).toContain('Retiro de efectivo en banco');
    expect(extra.disabled).toBeTrue();
  });

  it('skeleton while loading, empty state without accounts', () => {
    render({ loading: true });
    expect(el().querySelectorAll('.card--bone').length).toBeGreaterThan(0);
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('accounts', []);
    fixture.detectChanges();
    expect(el().textContent).toContain('No hay cuentas bancarias activas.');
  });

  it('with many accounts a search filters by bank, type or number', () => {
    const many = Array.from({ length: 8 }, (_, i) => bank(`x${i}`, i === 3 ? 'Banco Agromercantil' : `Cuenta ${i}`, i));
    render({ accounts: many });
    expect(picker.showSearch()).toBeTrue();
    picker.query.set('agromer');
    fixture.detectChanges();
    expect(cards().length).toBe(1);
    expect(cards()[0].textContent).toContain('Banco Agromercantil');
  });
});
