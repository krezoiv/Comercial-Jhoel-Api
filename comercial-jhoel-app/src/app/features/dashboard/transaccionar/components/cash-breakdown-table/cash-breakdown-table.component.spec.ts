import { TestBed } from '@angular/core/testing';

import { CashBreakdownTableComponent } from './cash-breakdown-table.component';

describe('CashBreakdownTableComponent — stock per denomination (optional)', () => {
  it('without `available` it renders as always (no stock, nothing flagged)', () => {
    const table = TestBed.createComponent(CashBreakdownTableComponent).componentInstance;
    table.cashCounts = { '200': 3 };
    expect(table.rows.find((r) => r.denomination === 200)?.available).toBeNull();
    expect(table.rows.some((r) => r.over)).toBeFalse();
    expect(table.rows.length).toBe(12);
  });

  it('with `available` it shows the stock and flags quantities above it', () => {
    const table = TestBed.createComponent(CashBreakdownTableComponent).componentInstance;
    table.cashCounts = { '200': 3, '100': 1 };
    table.available = { '200': 2, '100': 5 };
    const q200 = table.rows.find((r) => r.denomination === 200)!;
    const q100 = table.rows.find((r) => r.denomination === 100)!;
    expect(q200.available).toBe(2);
    expect(q200.over).toBeTrue();
    expect(q100.over).toBeFalse();
    expect(table.rows.find((r) => r.denomination === 0.01)?.available).toBe(0);
  });
});
