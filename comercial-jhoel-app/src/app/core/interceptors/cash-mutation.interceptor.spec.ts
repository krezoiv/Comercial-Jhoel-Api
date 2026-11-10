import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { CashControlSyncService } from '../services/cash-control-sync.service';
import { cashMutationInterceptor, isCashMutation } from './cash-mutation.interceptor';

describe('cashMutationInterceptor (real-time cash refresh)', () => {
  const api = environment.apiUrl;

  it('classifies writes on cash-moving resources only', () => {
    expect(isCashMutation('POST', `${api}/bank-deposits`)).toBeTrue();
    expect(isCashMutation('POST', `${api}/bank-deposits/123/void`)).toBeTrue();
    expect(isCashMutation('POST', `${api}/accounts-receivable/abc/charges`)).toBeTrue();
    expect(isCashMutation('PATCH', `${api}/assets/abc`)).toBeTrue();
    expect(isCashMutation('POST', `${api}/bank-transfers`)).toBeTrue();
    expect(isCashMutation('POST', `${api}/cash-control/movements`)).toBeTrue();
    expect(isCashMutation('GET', `${api}/bank-deposits/recent`)).toBeFalse();
    expect(isCashMutation('POST', `${api}/sales/confirm`)).toBeFalse();
    expect(isCashMutation('POST', 'https://otro.example.com/bank-deposits')).toBeFalse();
  });

  it('notifies after a successful write and stays silent on failures', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([cashMutationInterceptor])), provideHttpClientTesting()],
    });
    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);
    const sync = TestBed.inject(CashControlSyncService);
    let notifications = 0;
    sync.changed$.subscribe(() => notifications++);

    http.post(`${api}/bank-deposits`, {}).subscribe();
    controller.expectOne(`${api}/bank-deposits`).flush({ success: true, data: {} });
    expect(notifications).toBe(1);

    http.post(`${api}/bank-deposits`, {}).subscribe({ error: () => undefined });
    controller.expectOne(`${api}/bank-deposits`).flush({ message: 'x' }, { status: 400, statusText: 'Bad Request' });
    expect(notifications).toBe(1);

    http.get(`${api}/cash-control/balance`).subscribe();
    controller.expectOne(`${api}/cash-control/balance`).flush({ success: true, data: {} });
    expect(notifications).toBe(1);
    controller.verify();
  });
});
