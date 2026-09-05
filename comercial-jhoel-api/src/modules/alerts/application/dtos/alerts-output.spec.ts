import { Alert } from '../../domain/entities/alert.entity';
import { sortAlerts, toAlertOutput } from './alerts-output';

function makeAlert(overrides: Partial<Alert>): Alert {
  return {
    key: 'alert-1',
    type: 'LOW_INVENTORY',
    priority: 'MEDIUM',
    title: 'Title',
    description: 'Description',
    amount: null,
    date: null,
    route: '/dashboard',
    referenceId: 'ref-1',
    ...overrides,
  };
}

describe('sortAlerts', () => {
  it('orders CRITICAL before HIGH before MEDIUM', () => {
    const alerts = [
      makeAlert({ key: 'b', priority: 'MEDIUM' }),
      makeAlert({ key: 'a', priority: 'CRITICAL' }),
      makeAlert({ key: 'c', priority: 'HIGH' }),
    ];
    const sorted = sortAlerts(alerts);
    expect(sorted.map((a) => a.priority)).toEqual([
      'CRITICAL',
      'HIGH',
      'MEDIUM',
    ]);
  });

  it('breaks a same-priority tie deterministically by key, never by array order', () => {
    const alerts = [
      makeAlert({ key: 'zeta', priority: 'CRITICAL' }),
      makeAlert({ key: 'alpha', priority: 'CRITICAL' }),
    ];
    const sortedOnce = sortAlerts(alerts);
    const sortedReversed = sortAlerts([...alerts].reverse());
    expect(sortedOnce.map((a) => a.key)).toEqual(['alpha', 'zeta']);
    expect(sortedReversed.map((a) => a.key)).toEqual(['alpha', 'zeta']);
  });

  it('does not mutate the input array', () => {
    const alerts = [makeAlert({ key: 'b' }), makeAlert({ key: 'a' })];
    const original = [...alerts];
    sortAlerts(alerts);
    expect(alerts).toEqual(original);
  });

  it('returns an empty array when there are no alerts (sin datos)', () => {
    expect(sortAlerts([])).toEqual([]);
  });
});

describe('toAlertOutput', () => {
  it('carries every Alert field through and appends isRead', () => {
    const alert = makeAlert({ key: 'x', amount: 100, date: '2026-09-03' });
    expect(toAlertOutput(alert, true)).toEqual({ ...alert, isRead: true });
    expect(toAlertOutput(alert, false)).toEqual({ ...alert, isRead: false });
  });
});
