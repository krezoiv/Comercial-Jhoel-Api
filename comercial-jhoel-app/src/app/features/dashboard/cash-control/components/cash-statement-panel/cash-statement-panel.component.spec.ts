import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CashStatement, CashStatementDay, CashStatementRow, WarehouseCashAudit } from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { CashStatementCardsComponent } from '../cash-statement-cards/cash-statement-cards.component';
import { WarehouseAuditModalComponent } from '../warehouse-audit-modal/warehouse-audit-modal.component';
import { CashStatementPanelComponent } from './cash-statement-panel.component';

const row = (over: Partial<CashStatementRow> = {}): CashStatementRow => ({
  id: 'm1',
  sequence: 11,
  operationNumber: 'MOV-000011',
  createdAt: '2099-06-01T15:00:00Z',
  movementType: 'ENTRADA_MANUAL',
  originalMovementType: null,
  direction: 'IN',
  amount: 1000,
  previousBalance: 5250,
  newBalance: 6250,
  description: 'Entrada manual',
  beneficiary: null,
  reference: null,
  referenceType: null,
  referenceId: null,
  status: 'VIGENTE',
  voidedAt: null,
  voidReason: null,
  reversalOfId: null,
  reversalOfNumber: null,
  reason: null,
  username: 'admin',
  cutPeriodNumber: null,
  ...over,
});

const statement = (over: Partial<CashStatement> = {}): CashStatement => ({
  location: 'CAJA',
  period: {
    kind: 'BANK_DAY',
    businessDate: '2099-06-01',
    dateFrom: '2099-06-01',
    dateTo: '2099-06-01',
    windowStart: '2099-06-01T14:00:00Z',
    windowEnd: null,
    isCurrent: true,
    agentDayStatus: 'ABIERTO',
    openedByUsername: 'admin',
    anchorSource: 'APERTURA',
  },
  summary: {
    openingBalance: 5250,
    totalIn: 6700,
    totalOut: 3500,
    theoreticalBalance: 8450,
    kardexClosingBalance: 8450,
    consistent: true,
    movementCount: 2,
    lastMovement: null,
    toWarehouse: 0,
    fromWarehouse: 0,
    physical: {
      status: 'FALTANTE',
      movementsAfter: 0,
      count: {
        id: 'k1',
        source: 'ARQUEO_CAJA',
        number: 'Arqueo de Caja #1',
        countedAt: '2099-06-01T20:00:00Z',
        sequence: 13,
        theoretical: 8450,
        counted: 8400,
        difference: -50,
        result: 'FALTANTE',
        status: 'VIGENTE',
        username: 'admin',
        observations: null,
      },
    },
  },
  warnings: [],
  movements: {
    items: [row(), row({ id: 'm2', direction: 'OUT', amount: 800, newBalance: 5450, movementType: 'SALIDA_MANUAL' })],
    total: 2,
    page: 1,
    limit: 50,
    filteredIn: 1000,
    filteredOut: 800,
  },
  counts: [],
  cuts: [],
  custody: { cash: 8450, warehouse: 3500, total: 11950 },
  canViewCustody: true,
  opening: null,
  ...over,
});

const DAYS: CashStatementDay[] = [
  { businessDate: '2099-06-02', isCurrent: true, agentDayStatus: 'ABIERTO', openingBalance: 8450, totalIn: 0, totalOut: 0, closingBalance: 8450, movementCount: 0, lastCount: null },
  { businessDate: '2099-06-01', isCurrent: false, agentDayStatus: 'CERRADO', openingBalance: 5250, totalIn: 6700, totalOut: 3500, closingBalance: 8450, movementCount: 6, lastCount: null },
];

describe('Estado de Cuenta de Efectivo (Control de Efectivo)', () => {
  let service: CashControlService;
  let getStatement: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CashStatementPanelComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true) } },
      ],
    });
    service = TestBed.inject(CashControlService);
    getStatement = spyOn(service, 'getStatement').and.returnValue(of(statement()));
    spyOn(service, 'getStatementDays').and.returnValue(of(DAYS));
    spyOn(service, 'getBalance').and.returnValue(of({ balance: 8450, lastSequence: 13, lastMovementAt: null }));
  });

  it('shows the backend cards: opening, entries, exits, theoretical, physical and a red faltante', () => {
    const fixture = TestBed.createComponent(CashStatementPanelComponent);
    fixture.componentRef.setInput('canCustody', true);
    fixture.detectChanges();
    const cards = fixture.debugElement.query((d) => d.componentInstance instanceof CashStatementCardsComponent)
      .componentInstance as CashStatementCardsComponent;
    const byKey = Object.fromEntries(cards.cards().map((c) => [c.key, c]));
    expect(byKey['opening'].value).toContain('5,250.00');
    expect(byKey['in'].value).toContain('6,700.00');
    expect(byKey['out'].value).toContain('3,500.00');
    expect(byKey['theoretical'].value).toContain('8,450.00');
    expect(byKey['physical'].value).toContain('8,400.00');
    expect(byKey['difference'].tone).toBe('short');
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Total bajo custodia');
    expect(text).toContain('Saldo inicial');
    // Entries green, exits red, running balance from the Kardex.
    const html = fixture.nativeElement as HTMLElement;
    const rows = html.querySelectorAll('tbody tr');
    expect(rows[0].textContent).toContain('Saldo inicial');
    expect(rows[1].querySelector('td.in')?.textContent).toContain('1,000.00');
    expect(rows[2].querySelector('td.out')?.textContent).toContain('800.00');
    expect(rows[2].querySelector('td.sticky')?.textContent).toContain('5,450.00');
  });

  it('a cashier sees no custody, no physical cards and no Caja/Bodega switch', () => {
    getStatement.and.returnValue(of(statement({ counts: null, cuts: null, custody: null, canViewCustody: false, summary: { ...statement().summary, physical: null } })));
    const fixture = TestBed.createComponent(CashStatementPanelComponent);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).not.toContain('Total bajo custodia');
    expect(text).not.toContain('Efectivo físico');
    expect(text).not.toContain('Arqueo de Bodega');
  });

  it('sends the period and filters to the backend; the search is debounced', fakeAsync(() => {
    const fixture = TestBed.createComponent(CashStatementPanelComponent);
    fixture.componentRef.setInput('canCustody', true);
    fixture.detectChanges();
    const panel = fixture.componentInstance;
    panel.selectDay('2099-06-01');
    expect(getStatement.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ location: 'CAJA', bankDate: '2099-06-01', page: 1 }));
    panel.setMode('RANGE');
    panel.dateFrom.set('2099-06-01');
    panel.dateTo.set('2099-06-02');
    panel.reload(true);
    expect(getStatement.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ dateFrom: '2099-06-01', dateTo: '2099-06-02' }));
    const calls = getStatement.calls.count();
    panel.onSearch('juan');
    panel.onSearch('juan pérez');
    tick(299);
    expect(getStatement.calls.count()).toBe(calls);
    tick(1);
    expect(getStatement.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ search: 'juan pérez', page: 1 }));
    panel.setLocation('BODEGA');
    expect(getStatement.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ location: 'BODEGA' }));
  }));

  it('the Arqueo de Bodega shows faltante / sobrante live and sends the denominations', async () => {
    const register = spyOn(TestBed.inject(CashCustodyService), 'registerWarehouseAudit').and.returnValue(
      of({ number: 1, result: 'SOBRANTE', difference: 50 } as WarehouseCashAudit),
    );
    const modal = TestBed.createComponent(WarehouseAuditModalComponent).componentInstance;
    modal.open = true;
    modal.theoretical = 3500;
    modal.ngOnChanges();
    modal.onQuantityChange({ denomination: 100, quantity: 34 });
    modal.onQuantityChange({ denomination: 50, quantity: 1 });
    expect([modal.difference(), modal.result()]).toEqual([-50, 'FALTANTE']);
    modal.onQuantityChange({ denomination: 50, quantity: 3 });
    expect([modal.difference(), modal.result()]).toEqual([50, 'SOBRANTE']);
    await modal.save();
    const input = register.calls.mostRecent().args[0];
    expect(input.details.length).toBe(12);
    expect(input.clientRequestId).toBeTruthy();
  });
});
