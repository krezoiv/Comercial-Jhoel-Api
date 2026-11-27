import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { BankDepositOperation, TypeOperationEntry, TypeOperationList } from '../../../../../core/models';
import { AuthService } from '../../../../../core/services/auth.service';
import { BankDepositService } from '../../../../../core/services/bank-deposit.service';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { ReportsService } from '../../../../../core/services/reports.service';
import { BankDepositsReportPageComponent } from '../../../reports/bank-deposits/bank-deposits-report-page.component';
import { BankDepositDetailModalComponent } from '../../../reports/bank-deposits/components/bank-deposit-detail-modal/bank-deposit-detail-modal.component';
import { TypeOperationsPanelComponent } from './type-operations-panel.component';

const individual: TypeOperationEntry = {
  modality: 'INDIVIDUAL',
  id: 'op-1',
  createdAt: '2026-11-27T15:00:00Z',
  operationDate: '2026-11-27',
  description: 'Pago de luz',
  amount: 150,
  transactionCount: 1,
  bankName: 'BI',
  userId: 'u-1',
  username: 'cajero',
  status: 'VIGENTE',
  group: null,
};

const grupal: TypeOperationEntry = {
  modality: 'GRUPAL',
  id: 'g-25',
  createdAt: '2026-11-27T14:00:00Z',
  operationDate: '2026-11-27',
  description: 'Pagos varios del día',
  amount: 5000,
  transactionCount: 10,
  bankName: 'BI',
  userId: 'u-1',
  username: 'cajero',
  status: 'PARCIAL',
  group: {
    code: 'PG-000025',
    cashDirection: 'OUT',
    itemCount: 10,
    authorizedAmount: 5000,
    paidAmount: 1800,
    outstandingAmount: 3200,
    reservedAmount: 3200,
  },
};

const list = (items: TypeOperationEntry[]): TypeOperationList => ({
  items,
  total: items.length,
  page: 1,
  limit: 15,
  summary: { individualCount: 1, groupCount: 1, groupReserved: 3200, groupPaid: 1800, groupOutstanding: 3200 },
});

describe('Pago individual / Pago grupal dentro de Pago Varios y Préstamos Génesis', () => {
  let deposits: BankDepositService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: { isAdmin: () => false, currentUser: () => ({ id: 'u-1' }) } },
      ],
    });
    deposits = TestBed.inject(BankDepositService);
    spyOn(TestBed.inject(CashControlService), 'getBalance').and.returnValue(
      of({ balance: 1000, lastSequence: 1, lastMovementAt: null, reserved: 0, available: 1000 }),
    );
  });

  it('lists individual operations and groups with their MODALIDAD; filters by modality, status and code', () => {
    const getTypeOperations = spyOn(deposits, 'getTypeOperations').and.returnValue(of(list([grupal, individual])));
    const fixture = TestBed.createComponent(TypeOperationsPanelComponent);
    fixture.componentRef.setInput('transactionTypeId', 'pago-varios');
    fixture.componentRef.setInput('transactionTypeName', 'Pago Varios');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.chip--grupal').length).toBeGreaterThan(0);
    expect(element.querySelectorAll('.chip--individual').length).toBeGreaterThan(0);
    const text = element.textContent ?? '';
    expect(text).toContain('PG-000025');
    expect(text).toContain('GRUPAL');
    expect(text).toContain('INDIVIDUAL');
    expect(text).toContain('Q 3,200.00');

    const panel = fixture.componentInstance;
    panel.setModality('GRUPAL');
    panel.status.set('PARCIAL');
    panel.search.set(' PG-000025 ');
    panel.applyFilters();
    expect(getTypeOperations.calls.mostRecent().args).toEqual([
      'pago-varios',
      jasmine.objectContaining({ modality: 'GRUPAL', status: 'PARCIAL', search: 'PG-000025', page: 1 }),
    ]);
  });

  it('a group row opens the group inside Transaccionar; an individual row opens its operation', () => {
    spyOn(deposits, 'getTypeOperations').and.returnValue(of(list([grupal, individual])));
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));
    const fixture = TestBed.createComponent(TypeOperationsPanelComponent);
    fixture.componentRef.setInput('transactionTypeId', 'pago-varios');
    fixture.detectChanges();
    const panel = fixture.componentInstance;
    panel.open(grupal);
    expect(navigate).toHaveBeenCalledWith(['/dashboard/transaccionar/pago-grupal', 'g-25']);
    panel.open(individual);
    expect(panel.detailId()).toBe('op-1');
    expect([panel.statusText(grupal), panel.statusText(individual)]).toEqual(['Parcial', 'Vigente']);
  });

  it('the detail of a group operation says it belongs to a PAGO GRUPAL; an individual one does not', () => {
    const base = {
      id: 'op-6',
      transactionTypeName: 'Pago Varios',
      createdAt: '2026-11-27T15:00:00Z',
      transactionBankName: 'BI',
      operationDate: '2026-11-27',
      totalAmount: 500,
      transactionCount: 1,
      totalCash: 0,
      totalDistributed: 500,
      changeGiven: 0,
      netCashApplied: 0,
      username: 'cajero',
      isVoided: false,
      cashDetails: [],
      transactions: [],
    } as unknown as BankDepositOperation;
    const get = spyOn(deposits, 'getOperationById').and.returnValue(
      of({
        ...base,
        modality: 'GRUPAL',
        paymentGroup: {
          groupId: 'g-25',
          code: 'PG-000025',
          description: 'Pagos varios del día',
          groupStatus: 'PENDIENTE',
          itemId: 'i-6',
          itemNumber: 6,
          itemCount: 10,
          itemStatus: 'PAGADO',
          expectedAmount: 500,
          paidAmount: 500,
        },
      }),
    );
    const fixture = TestBed.createComponent(BankDepositDetailModalComponent);
    fixture.componentRef.setInput('operationId', 'op-6');
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    let text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Esta transacción pertenece a un PAGO GRUPAL');
    expect(text).toContain('PG-000025');
    expect(text).toContain('Transacción 6 de 10');
    expect(text).toContain('Pendiente');

    get.and.returnValue(of({ ...base, modality: 'INDIVIDUAL', paymentGroup: null }));
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).not.toContain('PAGO GRUPAL');
  });

  it('the transactions report filters by modality and shows the column', () => {
    const reports = TestBed.inject(ReportsService);
    const listSpy = spyOn(reports, 'getBankDepositsReport').and.returnValue(of({ items: [], total: 0, page: 1, limit: 20 }));
    spyOn(reports, 'getBankDepositsReportSummary').and.returnValue(
      of({ operationCount: 0, transactionCount: 0, totalAmount: 0, byBank: [] }),
    );
    const fixture = TestBed.createComponent(BankDepositsReportPageComponent);
    fixture.detectChanges();
    const page = fixture.componentInstance;
    page.draftModality.set('INDIVIDUAL');
    page.applyFilters();
    expect(listSpy.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ modality: 'INDIVIDUAL' }));
    expect(page.hasActiveFilters()).toBeTrue();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Modalidad');
  });
});
