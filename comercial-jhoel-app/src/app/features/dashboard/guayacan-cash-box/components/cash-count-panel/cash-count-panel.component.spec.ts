import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { GuayacanCashCount } from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { GuayacanCashBoxService } from '../../../../../core/services/guayacan-cash-box.service';
import { GuayacanCashCountPanelComponent } from './cash-count-panel.component';

const LAST_COUNT: GuayacanCashCount = {
  id: 'count-1',
  businessDate: '2026-11-02',
  totalCounted: 300,
  systemBalance: 300,
  difference: 0,
  notes: null,
  createdByUsername: 'erick',
  createdAt: '2026-11-02T20:00:00Z',
  details: [
    { denomination: 200, quantity: 1, subtotal: 200 },
    { denomination: 100, quantity: 1, subtotal: 100 },
  ],
};

describe('GuayacanCashCountPanelComponent (arqueo)', () => {
  let service: jasmine.SpyObj<GuayacanCashBoxService>;

  function create(balance: number, isAdmin = false) {
    const fixture = TestBed.createComponent(GuayacanCashCountPanelComponent);
    fixture.componentRef.setInput('balance', balance);
    fixture.componentRef.setInput('isAdmin', isAdmin);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    service = jasmine.createSpyObj<GuayacanCashBoxService>('GuayacanCashBoxService', [
      'getLatestCount',
      'registerCount',
      'registerMovement',
    ]);
    service.getLatestCount.and.returnValue(of(LAST_COUNT));
    service.registerCount.and.returnValue(of(LAST_COUNT));
    const confirm = jasmine.createSpyObj<ConfirmDialogService>('ConfirmDialogService', ['confirm']);
    confirm.confirm.and.resolveTo(true);
    TestBed.configureTestingModule({
      imports: [GuayacanCashCountPanelComponent],
      providers: [
        { provide: GuayacanCashBoxService, useValue: service },
        { provide: ConfirmDialogService, useValue: confirm },
      ],
    });
  });

  it('shows the current breakdown from the latest count', () => {
    const component = create(300).componentInstance;
    expect(component.totalCounted()).toBe(300);
    expect(component.difference()).toBe(0);
    expect(component.status()).toBe('green');
  });

  it('compares the counted cash against the Kardex live', () => {
    const component = create(305.5).componentInstance;
    expect(component.difference()).toBe(-5.5);
    component.onQuantityChange({ denomination: 5, quantity: 1 });
    component.onQuantityChange({ denomination: 0.5, quantity: 1 });
    expect(component.difference()).toBe(0);
  });

  it('saving an arqueo never registers a cash movement', async () => {
    const component = create(310).componentInstance;
    await component.save();

    expect(service.registerCount).toHaveBeenCalledTimes(1);
    expect(service.registerCount.calls.mostRecent().args[0].details.length).toBe(11);
    expect(service.registerMovement).not.toHaveBeenCalled();
  });

  it('only an admin gets the "Ajustar diferencia" action', () => {
    const userView = create(310, false).nativeElement as HTMLElement;
    expect(userView.textContent).not.toContain('Ajustar diferencia');

    const adminFixture = create(310, true);
    const requested: number[] = [];
    adminFixture.componentInstance.adjustRequested.subscribe((value) => requested.push(value));
    const button = Array.from((adminFixture.nativeElement as HTMLElement).querySelectorAll('button')).find((el) =>
      el.textContent?.includes('Ajustar diferencia'),
    )!;
    button.click();
    expect(requested).toEqual([-10]);
  });
});
