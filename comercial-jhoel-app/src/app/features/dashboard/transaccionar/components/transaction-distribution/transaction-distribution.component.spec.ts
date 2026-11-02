import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDistributionComponent } from './transaction-distribution.component';

describe('TransactionDistributionComponent', () => {
  let fixture: ComponentFixture<TransactionDistributionComponent>;
  let requested: number[];

  function render(amounts: number[], total: number): HTMLElement {
    fixture.componentRef.setInput('transactionAmounts', amounts);
    fixture.componentRef.setInput('totalDistributed', amounts.reduce((sum, a) => sum + a, 0));
    fixture.componentRef.setInput('totalAmount', total);
    fixture.componentRef.setInput('status', 'green');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function changeCount(el: HTMLElement, value: string): HTMLInputElement {
    const input = el.querySelector('#transaction-count') as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('change'));
    return input;
  }

  beforeEach(() => {
    spyOn(console, 'warn');
    fixture = TestBed.configureTestingModule({ imports: [TransactionDistributionComponent] }).createComponent(
      TransactionDistributionComponent,
    );
    requested = [];
    fixture.componentInstance.transactionCountRequested.subscribe((count) => requested.push(count));
  });

  it('shows one row locked to the total when there is a single transaction', () => {
    const el = render([850], 850);
    const rowInputs = el.querySelectorAll<HTMLInputElement>('.transaction-row__input');

    expect((el.querySelector('#transaction-count') as HTMLInputElement).value).toBe('1');
    expect(rowInputs.length).toBe(1);
    expect(rowInputs[0].disabled).toBeTrue();
  });

  it('enables manual editing with several rows', () => {
    const rowInputs = render([500, 600, 400], 1500).querySelectorAll<HTMLInputElement>('.transaction-row__input');
    expect(rowInputs.length).toBe(3);
    expect(Array.from(rowInputs).every((input) => !input.disabled)).toBeTrue();
  });

  it('requests a new count', () => {
    changeCount(render([850], 850), '3');
    expect(requested).toEqual([3]);
  });

  it('never goes below 1 — 0 is clamped and written back', () => {
    const el = render([500, 500], 1000);
    const input = changeCount(el, '0');
    expect(requested).toEqual([1]);
    expect(input.value).toBe('1');
  });

  it('ignores an invalid value and restores the real count', () => {
    const input = changeCount(render([850], 850), 'abc');
    expect(requested).toEqual([]);
    expect(input.value).toBe('1');
  });
});
