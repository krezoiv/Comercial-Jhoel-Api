import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Bank, TransactionBank } from '../../../../../core/models';
import { BankPickerModalComponent, BankPickerSelection } from './bank-picker-modal.component';

function agent(id: string, name: string, hasImage = false): TransactionBank {
  return { id, name, isActive: true, hasImage, createdAt: '', updatedAt: '2026-10-22T00:00:00Z' };
}

function account(id: string, name: string, overrides: Partial<Bank> = {}): Bank {
  return {
    id,
    name,
    accountNumber: id,
    accountTypeId: 't',
    accountTypeName: 'Monetaria',
    previousBalance: 0,
    finalBalance: 500,
    specialAccount: null,
    maxBalance: null,
    availableInTransaccionar: true,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    ...overrides,
  };
}

const AGENTS = [agent('a-akisi', 'Akísi'), agent('a-gtc', 'GTC'), agent('a-coop', 'Cooperativa')];
const ACCOUNTS = [
  account('genesis', 'Fundación Génesis Empresarial', { specialAccount: 'GENESIS' }),
  account('gtc-1', 'GTC'),
  account('gtc-2', 'GTC'),
];

describe('BankPickerModalComponent', () => {
  let fixture: ComponentFixture<BankPickerModalComponent>;
  let component: BankPickerModalComponent;
  let picked: BankPickerSelection[];
  let cancelled: number;

  function open(effect: 'DEPOSITO' | 'RETIRO' | 'REINTEGRO'): void {
    fixture.componentRef.setInput('transactionBanks', AGENTS);
    fixture.componentRef.setInput('bankAccounts', ACCOUNTS);
    fixture.componentRef.setInput('effect', effect);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  }

  function tiles(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.bank-tile'));
  }

  function tile(name: string): HTMLButtonElement {
    return tiles().find((el) => el.querySelector('.bank-tile__name')?.textContent?.trim() === name)!;
  }

  beforeEach(() => {
    spyOn(console, 'warn');
    fixture = TestBed.configureTestingModule({ imports: [BankPickerModalComponent] }).createComponent(
      BankPickerModalComponent,
    );
    component = fixture.componentInstance;
    picked = [];
    cancelled = 0;
    component.picked.subscribe((value) => picked.push(value));
    component.cancelled.subscribe(() => cancelled++);
  });

  it('título dinámico por operación', () => {
    open('DEPOSITO');
    expect(fixture.nativeElement.querySelector('.modal__title').textContent).toContain('Selecciona el banco para depositar');
    fixture.componentRef.setInput('effect', 'RETIRO');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.modal__title').textContent).toContain('Selecciona el banco para retirar');
    fixture.componentRef.setInput('effect', 'REINTEGRO');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.modal__title').textContent).toContain('Selecciona el banco para el reintegro');
  });

  it('muestra los bancos agente del catálogo con su nombre', () => {
    open('DEPOSITO');
    expect(tiles().map((el) => el.querySelector('.bank-tile__name')!.textContent!.trim())).toEqual([
      'Akísi',
      'GTC',
      'Cooperativa',
    ]);
  });

  it('Depositar → Akisi emite Fundación Génesis Empresarial', fakeAsync(() => {
    open('DEPOSITO');
    tile('Akísi').click();
    tick(200);
    expect(picked.length).toBe(1);
    expect(picked[0].transactionBank.id).toBe('a-akisi');
    expect(picked[0].account.id).toBe('genesis');
  }));

  it('banco sin cuenta: deshabilitado, con mensaje y registrado para diagnóstico', fakeAsync(() => {
    open('DEPOSITO');
    const coop = tile('Cooperativa');
    expect(coop.disabled).toBeTrue();
    expect(coop.textContent).toContain('no tiene una cuenta asignada');
    expect(console.warn).toHaveBeenCalled();
    coop.click();
    tick(200);
    expect(picked.length).toBe(0);
  }));

  it('muestra el logo si el banco tiene imagen, si no las iniciales', () => {
    fixture.componentRef.setInput('transactionBanks', [agent('a-akisi', 'Akísi', true), agent('a-gtc', 'GTC')]);
    fixture.componentRef.setInput('bankAccounts', ACCOUNTS);
    fixture.componentRef.setInput('effect', 'DEPOSITO');
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    const img: HTMLImageElement | null = tile('Akísi').querySelector('.bank-mark img');
    expect(img?.src).toContain('/public-transaction-banks/images/a-akisi?v=');
    expect(tile('GTC').querySelector('.bank-mark img')).toBeNull();
    expect(tile('GTC').querySelector('.bank-mark')!.textContent!.trim()).toBe('GTC');
  });

  it('Reintegro → Akisi queda deshabilitado (Génesis no puede ser el origen)', () => {
    open('REINTEGRO');
    expect(tile('Akísi').disabled).toBeTrue();
  });

  it('varias cuentas (GTC): se elige la cuenta en el modal, nunca una por defecto', fakeAsync(() => {
    open('RETIRO');
    tile('GTC').click();
    fixture.detectChanges();
    tick(200);
    expect(picked.length).toBe(0);
    const options: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.account-option'));
    expect(options.length).toBe(2);
    options[1].click();
    tick(200);
    expect(picked[0].account.id).toBe('gtc-2');
  }));

  it('cancelar cierra sin emitir selección; doble clic emite una sola vez', fakeAsync(() => {
    open('DEPOSITO');
    const close: HTMLButtonElement = fixture.nativeElement.querySelector('.modal__close');
    close.click();
    close.click();
    tick(200);
    expect(cancelled).toBe(1);
    expect(picked.length).toBe(0);
  }));

  it('al reabrir no conserva el paso de cuentas anterior', fakeAsync(() => {
    open('DEPOSITO');
    tile('GTC').click();
    fixture.detectChanges();
    expect(component.pendingOption()).not.toBeNull();
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    open('RETIRO');
    expect(component.pendingOption()).toBeNull();
    tick(200);
  }));
});
