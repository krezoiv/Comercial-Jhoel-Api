import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { BankDepositsReportFilters } from '../../../../core/models';
import { ReportsService } from '../../../../core/services/reports.service';
import { BankDepositsReportPageComponent } from './bank-deposits-report-page.component';

describe('BankDepositsReportPageComponent (descripción / beneficiario)', () => {
  let page: BankDepositsReportPageComponent;
  let listSpy: jasmine.Spy;
  let exportSpy: jasmine.Spy;

  const lastFilters = (spy: jasmine.Spy) =>
    spy.calls.mostRecent().args[0] as BankDepositsReportFilters;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankDepositsReportPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    const reports = TestBed.inject(ReportsService);
    listSpy = spyOn(reports, 'getBankDepositsReport').and.returnValue(
      of({ items: [], total: 0, page: 1, limit: 20 }),
    );
    spyOn(reports, 'getBankDepositsReportSummary').and.returnValue(
      of({
        operationCount: 0,
        transactionCount: 0,
        totalAmount: 0,
        byBank: [],
      }),
    );
    exportSpy = spyOn(reports, 'exportBankDepositsReportPdf').and.returnValue(
      of(new Blob()),
    );
    page = TestBed.createComponent(
      BankDepositsReportPageComponent,
    ).componentInstance;
  });

  it('searches by beneficiary/description together with the other filters', () => {
    page.draftSearch.set('  Juan Pérez ');
    page.draftTransactionTypeId.set('type-1');
    page.applyFilters();
    expect(lastFilters(listSpy)).toEqual(
      jasmine.objectContaining({
        search: 'Juan Pérez',
        transactionTypeId: 'type-1',
      }),
    );
  });

  it('daily, monthly and historical ranges keep the search', () => {
    page.draftSearch.set('préstamo');
    page.applyPreset('day');
    expect(lastFilters(listSpy).startDate).toBe(lastFilters(listSpy).endDate);
    page.applyPreset('month');
    expect(lastFilters(listSpy).startDate?.endsWith('-01')).toBeTrue();
    page.applyPreset('history');
    expect(lastFilters(listSpy).startDate).toBeUndefined();
    expect(lastFilters(listSpy).endDate).toBeUndefined();
    expect(lastFilters(listSpy).search).toBe('préstamo');
  });

  it('exports with exactly the applied search', () => {
    page.draftSearch.set('Distribuidora ABC');
    page.applyFilters();
    page.exportPdf();
    expect(lastFilters(exportSpy).search).toBe('Distribuidora ABC');
  });

  it('clearing the filters clears the search', () => {
    page.draftSearch.set('x');
    page.applyFilters();
    page.clearFilters();
    expect(page.search()).toBe('');
    expect(lastFilters(listSpy).search).toBeUndefined();
  });
});
