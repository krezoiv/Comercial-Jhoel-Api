import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionType } from '../../../../../core/models';
import { OperationCardsComponent } from './operation-cards.component';

function type(id: string, name: string, balanceEffect: TransactionType['balanceEffect']): TransactionType {
  return { id, name, icon: 'wallet', balanceEffect, cashEffect: 'NONE', isActive: true, createdAt: '', updatedAt: '' };
}

describe('OperationCardsComponent — operaciones financieras', () => {
  let fixture: ComponentFixture<OperationCardsComponent>;
  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [OperationCardsComponent] });
    fixture = TestBed.createComponent(OperationCardsComponent);
    fixture.componentRef.setInput('types', [
      type('d', 'Depósitos', 'DEPOSITO'),
      type('p', 'Pagos Varios', null),
      type('r', 'Retiros', 'RETIRO'),
    ]);
    fixture.detectChanges();
  });

  it('one coloured card per operation, with description and action', () => {
    const cards = el().querySelectorAll<HTMLButtonElement>('button.op');
    expect(cards.length).toBe(3);
    expect(cards[0].style.getPropertyValue('--tone')).toBe('#16a34a');
    expect(cards[1].style.getPropertyValue('--tone')).toBe('#ea580c');
    expect(cards[2].style.getPropertyValue('--tone')).toBe('#dc2626');
    expect(cards[0].textContent).toContain('Depósito de un cliente en un banco agente.');
    expect(cards[0].textContent).toContain('Registrar');
  });

  it('clicking a card emits that operation (the page opens it as before)', () => {
    const chosen: string[] = [];
    fixture.componentInstance.selected.subscribe((t) => chosen.push(t.id));
    el().querySelectorAll<HTMLButtonElement>('button.op')[2].click();
    expect(chosen).toEqual(['r']);
  });

  it('disabled while an operation is being chosen; skeleton while loading; empty state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(el().querySelector<HTMLButtonElement>('button.op')!.disabled).toBeTrue();
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(el().querySelectorAll('.op--bone').length).toBe(6);
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('types', []);
    fixture.detectChanges();
    expect(el().textContent).toContain('Aún no hay tipos de transacción activos.');
  });
});
