import { TestBed } from '@angular/core/testing';

import { LoadedCashCountInfo, cashCountFromRows } from '../models';
import { CuadreAgentesStateService } from './cuadre-agentes-state.service';

const INFO: LoadedCashCountInfo = {
  id: 'c1',
  number: 7,
  countedAt: '2026-11-11T15:00:00.000Z',
  businessDate: '2026-11-11',
  createdByUsername: 'supervisor',
  totalCounted: 2001,
  isFromReferenceDay: true,
};

describe('CuadreAgentesStateService (origin of the breakdown)', () => {
  let state: CuadreAgentesStateService;

  beforeEach(() => {
    state = TestBed.inject(CuadreAgentesStateService);
    state.clear();
  });

  it('starts as a manual count', () => {
    expect(state.origin()).toEqual({ loadedCount: null, modifiedAfterLoad: false });
    expect(state.hasQuantities()).toBeFalse();
  });

  it('loading an arqueo copies its quantities and is not "modified"', () => {
    const counts = cashCountFromRows([{ denomination: 200, quantity: 10 }, { denomination: 0.01, quantity: 100 }]);
    state.loadFromCount(counts, INFO);
    counts[200] = 99; // an independent copy
    expect(state.cashCounts()[200]).toBe(10);
    expect(state.origin().loadedCount?.id).toBe('c1');
    expect(state.origin().modifiedAfterLoad).toBeFalse();
  });

  it('editing after loading keeps the reference and marks it modified; re-typing the same value does not', () => {
    state.loadFromCount(cashCountFromRows([{ denomination: 0.01, quantity: 100 }]), INFO);
    state.setCount(0.01, 100);
    expect(state.origin().modifiedAfterLoad).toBeFalse();
    state.setCount(0.01, 150);
    expect(state.origin()).toEqual({ loadedCount: INFO, modifiedAfterLoad: true });
  });

  it('"Limpiar" returns to a manual count; details always list all 12 denominations', () => {
    state.loadFromCount(cashCountFromRows([{ denomination: 5, quantity: 2 }]), INFO);
    state.clear();
    expect(state.origin().loadedCount).toBeNull();
    expect(state.hasQuantities()).toBeFalse();
    const details = state.details();
    expect(details.length).toBe(12);
    expect(details[11]).toEqual({ denomination: 0.01, quantity: 0 });
  });
});
