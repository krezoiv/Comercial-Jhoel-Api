import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCount, createEmptyCashCount } from '../../../../../core/models';
import {
  CustodyCountModalComponent,
  CustodyQuantityChange,
  formatSignedDifference,
  parseQuantity,
} from './custody-count-modal.component';

function counts(rows: Array<[number, number]>): CashCount {
  const result = createEmptyCashCount();
  for (const [denomination, quantity] of rows) {
    (result as Record<number, number>)[denomination] = quantity;
  }
  return result;
}

describe('CustodyCountModalComponent — Arqueo General de Efectivo', () => {
  let fixture: ComponentFixture<CustodyCountModalComponent>;
  let modal: CustodyCountModalComponent;

  function render(cash: CashCount, warehouse: CashCount, cashTheoretical: number | null = 5000, warehouseTheoretical: number | null = 3000) {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('cashCounts', cash);
    fixture.componentRef.setInput('warehouseCounts', warehouse);
    fixture.componentRef.setInput('origin', { loadedCount: null, modifiedAfterLoad: false });
    fixture.componentRef.setInput('cashTheoretical', cashTheoretical);
    fixture.componentRef.setInput('warehouseTheoretical', warehouseTheoretical);
    fixture.detectChanges();
  }

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CustodyCountModalComponent] });
    fixture = TestBed.createComponent(CustodyCountModalComponent);
    modal = fixture.componentInstance;
  });

  it('shows two independent breakdowns of the 12 denominations (Caja and Bodega)', () => {
    render(createEmptyCashCount(), createEmptyCashCount());
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.panel--caja input').length).toBe(12);
    expect(element.querySelectorAll('.panel--bodega input').length).toBe(12);
    expect(text()).toContain('Arqueo General de Efectivo');
    expect(text()).toContain('Total contado en Caja');
    expect(text()).toContain('Total contado en Bodega');
  });

  it('a Caja input only emits a Caja change and a Bodega input only a Bodega change', () => {
    render(createEmptyCashCount(), createEmptyCashCount());
    const cash: CustodyQuantityChange[] = [];
    const warehouse: CustodyQuantityChange[] = [];
    modal.cashQuantity.subscribe((change) => cash.push(change));
    modal.warehouseQuantity.subscribe((change) => warehouse.push(change));
    const element = fixture.nativeElement as HTMLElement;
    const cashInput = element.querySelector<HTMLInputElement>('.panel--caja input')!;
    cashInput.value = '7';
    cashInput.dispatchEvent(new Event('input'));
    const warehouseInput = element.querySelector<HTMLInputElement>('.panel--bodega input')!;
    warehouseInput.value = '3';
    warehouseInput.dispatchEvent(new Event('input'));
    expect(cash).toEqual([{ denomination: 200, quantity: 7 }]);
    expect(warehouse).toEqual([{ denomination: 200, quantity: 3 }]);
  });

  it('totals, individual differences and the consolidated difference (example: −Q100 / +Q100 / Q0)', () => {
    render(counts([[200, 24], [100, 1]]), counts([[200, 15], [100, 1]]));
    expect(modal.cashTotal()).toBe(4900);
    expect(modal.warehouseTotal()).toBe(3100);
    expect(modal.countedTotal()).toBe(8000);
    expect(modal.theoreticalTotal()).toBe(8000);
    expect(modal.cashDiff()).toBe(-100);
    expect(modal.warehouseDiff()).toBe(100);
    expect(modal.consolidatedDiff()).toBe(0);
    // The consolidated zero never hides the individual differences.
    expect(modal.offsetWarning()).toContain('Caja tiene un faltante de');
    expect(modal.offsetWarning()).toContain('Bodega tiene un sobrante de');
    expect(text()).toContain('El consolidado no compensa');
  });

  it('no offset warning when both locations agree', () => {
    render(counts([[200, 25]]), counts([[200, 15]]));
    expect(modal.cashDiff()).toBe(0);
    expect(modal.warehouseDiff()).toBe(0);
    expect(modal.offsetWarning()).toBeNull();
  });

  it('without theoretical balances the differences are unknown, never zero', () => {
    render(counts([[200, 1]]), createEmptyCashCount(), null, null);
    expect(modal.cashDiff()).toBeNull();
    expect(modal.consolidatedDiff()).toBeNull();
    expect(formatSignedDifference(null)).toBe('—');
  });

  it('quantities are whole and never negative; the sign of a difference is always shown', () => {
    expect(parseQuantity('2.7')).toBe(2);
    expect(parseQuantity('-4')).toBe(0);
    expect(parseQuantity('')).toBe(0);
    expect(parseQuantity('abc')).toBe(0);
    expect(formatSignedDifference(-100)).toContain('−');
    expect(formatSignedDifference(100)).toContain('+');
  });

  it('Cancelar and Confirmar Arqueo are separate events', () => {
    render(createEmptyCashCount(), createEmptyCashCount());
    let cancelled = 0;
    let confirmed = 0;
    modal.cancelled.subscribe(() => cancelled++);
    modal.confirmed.subscribe(() => confirmed++);
    const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.actions button'));
    (buttons.find((b) => b.textContent?.includes('Cancelar')) as HTMLButtonElement).click();
    (buttons.find((b) => b.textContent?.includes('Confirmar Arqueo')) as HTMLButtonElement).click();
    expect(cancelled).toBe(1);
    expect(confirmed).toBe(1);
  });
});
