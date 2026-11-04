import { TestBed } from '@angular/core/testing';

import { GuayacanCashSyncService } from './guayacan-cash-sync.service';

describe('GuayacanCashSyncService', () => {
  it('notifies the same tab synchronously', () => {
    const service = TestBed.inject(GuayacanCashSyncService);
    let calls = 0;
    service.changed$.subscribe(() => calls++);

    service.notifyChanged();

    expect(calls).toBe(1);
  });

  it('notifies other tabs through BroadcastChannel', async () => {
    const service = TestBed.inject(GuayacanCashSyncService);
    const otherTab = new BroadcastChannel('cj-guayacan-cash');
    const received = new Promise<unknown>((resolve) => (otherTab.onmessage = (event) => resolve(event.data)));

    service.notifyChanged();

    expect(await received).toBe('changed');
    otherTab.close();
  });

  it('a message from another tab reaches this tab’s subscribers', async () => {
    const service = TestBed.inject(GuayacanCashSyncService);
    const reached = new Promise<void>((resolve) => service.changed$.subscribe(() => resolve()));
    const otherTab = new BroadcastChannel('cj-guayacan-cash');

    otherTab.postMessage('changed');

    await reached;
    otherTab.close();
    expect(true).toBeTrue();
  });
});
