import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { GuayacanCashCount } from '../../../../../core/models';
import { AuthService } from '../../../../../core/services/auth.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { GuayacanCashBoxService } from '../../../../../core/services/guayacan-cash-box.service';
import { GuayacanCashCountPanelComponent } from './cash-count-panel.component';

const LAST_COUNT: GuayacanCashCount = {
  id: 'count-1',
  sequence: 1,
  number: 'ARQ-0001',
  status: 'CUADRADO',
  lastMovementId: 'mov-1',
  lastMovementSequence: 7,
  createdBy: 'user-1',
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
  let confirm: jasmine.SpyObj<ConfirmDialogService>;
  let notifications: jasmine.SpyObj<NotificationService>;

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
    confirm = jasmine.createSpyObj<ConfirmDialogService>('ConfirmDialogService', ['confirm']);
    confirm.confirm.and.resolveTo(true);
    notifications = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
    TestBed.configureTestingModule({
      imports: [GuayacanCashCountPanelComponent],
      providers: [
        { provide: GuayacanCashBoxService, useValue: service },
        { provide: ConfirmDialogService, useValue: confirm },
        { provide: NotificationService, useValue: notifications },
        { provide: AuthService, useValue: { currentUser: signal({ username: 'erick' }) } },
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

  it('colors: zero green, positive (sobrante) yellow, negative (faltante) red', () => {
    expect(create(300).componentInstance.status()).toBe('green');
    expect(create(250).componentInstance.status()).toBe('yellow');
    expect(create(350).componentInstance.status()).toBe('red');
  });

  it('confirmation shows counted, system balance, difference, user and date; success shows the number', async () => {
    const component = create(350).componentInstance;
    service.registerCount.and.returnValue(of({ ...LAST_COUNT, number: 'ARQ-0042' }));

    await component.save();

    const message = confirm.confirm.calls.mostRecent().args[0].message ?? '';
    expect(message).toContain('Total contado: Q 300.00');
    expect(message).toContain('Saldo según el sistema: Q 350.00');
    expect(message).toContain('Diferencia: -Q 50.00');
    expect(message).toContain('faltante');
    expect(message).toContain('Usuario: erick');
    expect(message).toContain('Fecha:');
    expect(notifications.success).toHaveBeenCalledWith('Arqueo ARQ-0042 registrado.');
  });

  it('retrying the same arqueo reuses its request id; a new arqueo gets a new one', async () => {
    const component = create(300).componentInstance;
    service.registerCount.and.returnValue(throwError(() => new Error('red')));
    await component.save();
    await component.save();
    const [first, second] = service.registerCount.calls.all().map((call) => call.args[0].clientRequestId);
    expect(first).toBe(second);

    service.registerCount.and.returnValue(of(LAST_COUNT));
    await component.save();
    await component.save();
    const ids = service.registerCount.calls.all().map((call) => call.args[0].clientRequestId);
    expect(ids[3]).not.toBe(ids[2]);
  });
});
