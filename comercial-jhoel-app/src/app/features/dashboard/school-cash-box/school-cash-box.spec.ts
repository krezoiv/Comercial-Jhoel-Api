import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import {
  Bank,
  SchoolCashReceipt,
  SchoolCashSummary,
  SchoolListPermission,
  SchoolQuotation,
  calculateCuadreResult,
  isSchoolCashBank,
  schoolPaymentDestination,
} from '../../../core/models';
import { BankService } from '../../../core/services/bank.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { SchoolCashBoxService } from '../../../core/services/school-cash-box.service';
import { SchoolListService } from '../../../core/services/school-list.service';
import { SchoolCashBoxPageComponent } from './school-cash-box-page.component';
import { SchoolCashSummaryComponent } from './components/school-cash-summary/school-cash-summary.component';
import { SchoolCashPendingComponent } from './components/school-cash-pending/school-cash-pending.component';
import { SchoolCashTransferModalComponent } from './components/school-cash-transfer-modal/school-cash-transfer-modal.component';
import { SchoolCashCountModalComponent } from './components/school-cash-count-modal/school-cash-count-modal.component';
import { SchoolCashExitModalComponent } from './components/school-cash-exit-modal/school-cash-exit-modal.component';
import { SchoolCashReportsComponent } from './components/school-cash-reports/school-cash-reports.component';
import { SchoolCashChartsComponent } from './components/school-cash-charts/school-cash-charts.component';
import { SchoolCashCustomersComponent } from './components/school-cash-customers/school-cash-customers.component';
import { SchoolCashCustomerPageComponent } from './customer/school-cash-customer-page.component';
import { SchoolPaymentModalComponent } from '../school-lists/components/school-payment-modal/school-payment-modal.component';

const bank = (id: string, name: string, specialAccount: Bank['specialAccount'] = null): Bank => ({
  id,
  name,
  accountNumber: '000-1',
  accountTypeId: 'at',
  accountTypeName: 'Monetaria',
  previousBalance: 0,
  finalBalance: 1000,
  specialAccount,
  maxBalance: null,
  availableInTransaccionar: true,
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
});

const BANKS = [bank('b1', 'Banco Industrial', 'BANCO_INDUSTRIAL'), bank('b2', 'Promérica'), bank('g', 'Génesis', 'GENESIS')];

const summary = (over: Partial<SchoolCashSummary> = {}): SchoolCashSummary => ({
  cashBalance: 1250,
  pendingTransfer: 500,
  pendingReceipts: 2,
  oldestPendingAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
  transferredTotal: 200,
  transfersCount: 1,
  collected: { total: 1950, cash: 1050, transfer: 500, deposit: 200, other: 200, refunds: 0, advances: 800, installments: 1150, beforeCashBox: 0 },
  sales: { total: 3000, count: 4 },
  customersBalance: 1050,
  customersWithBalance: 2,
  exitsTotal: 0,
  adjustmentsNet: 0,
  lastCount: null,
  pendingByBank: [{ bankId: 'b1', bankName: 'Banco Industrial', pending: 500, receipts: 2 }],
  period: { from: null, to: null, granularity: 'day' },
  series: [
    { start: '2026-11-18', cash: 0, bank: 0, other: 0, total: 0 },
    { start: '2026-11-19', cash: 100, bank: 50, other: 0, total: 150 },
  ],
  portfolio: { lists: 5, paid: 1, partial: 2, pending: 1, cancelled: 1, paidAmount: 250, partialBalance: 650, pendingBalance: 400 },
  customers: { total: 4, withBalance: 3, solvent: 1, paying: 2, notPaying: 1 },
  recent: [],
  ...over,
});

const receipt = (id: string, bankId: string, pending: number): SchoolCashReceipt => ({
  id,
  movementNumber: `MCL-${id}`,
  paymentId: `p-${id}`,
  receiptNumber: `RLE-${id}`,
  quotationId: 'q1',
  quotationNumber: 'LE-000001',
  customerName: 'María López',
  paymentMethod: 'TRANSFERENCIA',
  bankId,
  bankName: bankId === 'b1' ? 'Banco Industrial' : 'Promérica',
  reference: 'REF',
  amount: pending,
  transferred: 0,
  refunded: 0,
  pending,
  transferStatus: 'PENDIENTE',
  receivedAt: new Date().toISOString(),
  userName: 'cajero',
});

const MANAGER: SchoolListPermission[] = ['school_lists.view', 'school_lists.cash.view', 'school_lists.cash.count', 'school_lists.cash.reports'];
const ADMIN: SchoolListPermission[] = [
  ...MANAGER,
  'school_lists.cash.transfer',
  'school_lists.cash.exit',
  'school_lists.cash.adjust',
  'school_lists.cash.authorize',
];

function setup(permissions: SchoolListPermission[]): { lists: SchoolListService; cash: SchoolCashBoxService } {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true), pending: () => null } },
      { provide: BankService, useValue: { getBanks: () => of(BANKS) } },
    ],
  });
  const lists = TestBed.inject(SchoolListService);
  const granted = new Set(permissions);
  spyOn(lists, 'can').and.callFake((p: SchoolListPermission) => granted.has(p));
  lists.permissionsLoaded.set(true);
  const cash = TestBed.inject(SchoolCashBoxService);
  return { lists, cash };
}

describe('Caja de Listas — reglas compartidas', () => {
  it('only regular accounts receive list money; each method says where the money goes', () => {
    expect(BANKS.filter(isSchoolCashBank).map((b) => b.id)).toEqual(['b1', 'b2']);
    expect(schoolPaymentDestination('EFECTIVO')).toContain('Caja de Listas');
    expect(schoolPaymentDestination('TRANSFERENCIA', 'Banco Industrial')).toContain('pendiente de trasladar');
    expect(schoolPaymentDestination('TARJETA')).toContain('fuera de la Caja de Listas');
  });

  it('the agents cuadre subtracts the list money still in banks', () => {
    // caja 1000 + Bodega 0 + bancos 5000 (incluye 500 de listas) + CxC 0 − activos 0 − 500
    expect(calculateCuadreResult(1000, 5000, 0, 0, 0, 500)).toBe(5500);
    expect(calculateCuadreResult(1000, 5000, 0, 0)).toBe(6000);
  });
});

describe('SchoolCashBoxPageComponent', () => {
  it('a role without cash.view sees no caja and loads nothing', () => {
    const { cash } = setup(['school_lists.view']);
    const load = spyOn(cash, 'getSummary').and.returnValue(of(summary()));
    const fixture = TestBed.createComponent(SchoolCashBoxPageComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('no tiene acceso');
    expect(load).not.toHaveBeenCalled();
  });

  it('shows the balance, the pending badge and the tabs; reports only with permission', () => {
    const { cash } = setup(['school_lists.view', 'school_lists.cash.view']);
    spyOn(cash, 'getSummary').and.returnValue(of(summary()));
    const fixture = TestBed.createComponent(SchoolCashBoxPageComponent);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('.hero__balance')?.textContent).toContain('1,250.00');
    expect(html.querySelector('.tabs__badge')?.textContent?.trim()).toBe('2');
    const tabs = [...html.querySelectorAll('[role="tab"]')].map((t) => t.textContent?.trim() ?? '');
    expect(tabs.some((t) => t.startsWith('Reportes'))).toBeFalse();
    expect(tabs.some((t) => t.startsWith('Clientes'))).toBeFalse();
    // Only administrators get "Transferir a Caja de Listas".
    expect(html.textContent).not.toContain('Transferir a Caja de Listas');
  });
});

describe('SchoolCashSummaryComponent', () => {
  it('cards use one source each and alerts warn about old pending money and count differences', () => {
    setup(MANAGER);
    const fixture = TestBed.createComponent(SchoolCashSummaryComponent);
    fixture.componentRef.setInput(
      'summary',
      summary({
        lastCount: {
          id: 'k1', countNumber: 'ACL-000001', theoreticalBalance: 1250, countedTotal: 1200, difference: -50,
          status: 'FALTANTE', lastMovementNumber: 'MCL-000009', observations: null, businessDate: '2026-11-18',
          userName: 'super', createdAt: '2026-11-18T20:00:00Z', details: [],
        },
      }),
    );
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    const byLabel = Object.fromEntries([...comp.primary(), ...comp.secondary()].map((k) => [k.label, k.value]));
    expect(byLabel['Total vendido']).toContain('3,000.00');
    expect(byLabel['Total abonado / recaudado']).toContain('1,950.00');
    expect(byLabel['Pendiente de cobro']).toContain('1,050.00');
    expect(byLabel['Efectivo disponible en caja']).toContain('1,250.00');
    expect(byLabel['En bancos por trasladar']).toContain('500.00');
    expect(byLabel['Clientes con saldo pendiente']).toBe('3');
    expect(byLabel['Clientes solventes']).toBe('1');
    expect(byLabel['Total de listas']).toBe('5');
    const alerts = comp.alerts().map((a) => a.text).join(' | ');
    expect(alerts).toContain('hace 5 día');
    expect(alerts).toContain('faltante');
    expect(alerts).toContain('no han hecho ningún abono');
  });

  it('customer cards open the Clientes tab with their filter; the period chips emit ranges', () => {
    setup(MANAGER);
    const fixture = TestBed.createComponent(SchoolCashSummaryComponent);
    fixture.componentRef.setInput('summary', summary());
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    const views: string[] = [];
    comp.customers.subscribe((v) => views.push(v));
    comp.open(comp.secondary().find((k) => k.label === 'Clientes solventes')!);
    comp.open(comp.primary().find((k) => k.label === 'Clientes con saldo pendiente')!);
    expect(views).toEqual(['SOLVENT', 'WITH_BALANCE']);
    const periods: unknown[] = [];
    comp.periodChange.subscribe((p) => periods.push(p));
    comp.choose('MONTH');
    comp.setGranularity('week');
    expect(periods[0]).toEqual(jasmine.objectContaining({ granularity: 'day', dateFrom: jasmine.stringMatching(/-01$/) }));
    expect(periods[1]).toEqual(jasmine.objectContaining({ granularity: 'week' }));
  });
});

describe('SchoolCashChartsComponent', () => {
  it('draws sales vs collected, methods, evolution and portfolio from the summary', () => {
    setup(MANAGER);
    const fixture = TestBed.createComponent(SchoolCashChartsComponent);
    fixture.componentRef.setInput('summary', summary());
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    expect(comp.salesVsCollected().map((b) => [b.label, b.value])).toEqual([
      ['Total vendido', 3000],
      ['Total abonado', 1950],
      ['Pendiente de cobro', 1050],
    ]);
    expect(comp.salesVsCollected()[0].width).toBe(100);
    expect(comp.byMethod().map((b) => b.value)).toEqual([1050, 500, 200, 200]);
    expect(comp.evolution().items.length).toBe(2);
    expect(comp.portfolio()!.segments.map((s) => s.count)).toEqual([1, 2, 1]);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('1 lista(s) canceladas');
  });
});

describe('SchoolCashPendingComponent', () => {
  it('selects payments of ONE bank, validates partial amounts and opens the transfer', () => {
    const { cash } = setup(ADMIN);
    spyOn(cash, 'getReceipts').and.returnValue(of([receipt('r1', 'b1', 300), receipt('r2', 'b1', 200), receipt('r3', 'b2', 100)]));
    spyOn(cash, 'getTransfers').and.returnValue(of({ items: [], total: 0, page: 1, limit: 20 }));
    const fixture = TestBed.createComponent(SchoolCashPendingComponent);
    fixture.componentInstance.ngOnChanges();
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    const [r1, r2, r3] = comp.receipts();

    comp.toggle(r1);
    expect(comp.selectionBank()).toBe('b1');
    expect(comp.isSelectable(r3)).toBeFalse();
    comp.toggle(r3);
    expect(comp.lines().length).toBe(1);
    comp.toggle(r2);
    expect(comp.selectionTotal()).toBe(500);
    comp.setAmount(r1, 300.01);
    expect(comp.selectionValid()).toBeFalse();
    comp.setAmount(r1, 120.5);
    expect(comp.selectionValid()).toBeTrue();
    expect(comp.selectionTotal()).toBe(320.5);
  });

  it('a manager without transfer permission cannot select', () => {
    const { cash } = setup(MANAGER);
    spyOn(cash, 'getReceipts').and.returnValue(of([receipt('r1', 'b1', 300)]));
    spyOn(cash, 'getTransfers').and.returnValue(of({ items: [], total: 0, page: 1, limit: 20 }));
    const fixture = TestBed.createComponent(SchoolCashPendingComponent);
    fixture.componentInstance.ngOnChanges();
    fixture.detectChanges();
    expect(fixture.componentInstance.isSelectable(fixture.componentInstance.receipts()[0])).toBeFalse();
  });
});

describe('SchoolCashTransferModalComponent', () => {
  it('posts the selected payments once per opening (same request id on retry)', () => {
    const { cash } = setup(ADMIN);
    const post = spyOn(cash, 'registerTransfer').and.returnValue(
      of({ id: 't1', transferNumber: 'TCL-000001', amount: 320.5 }) as never,
    );
    const fixture = TestBed.createComponent(SchoolCashTransferModalComponent);
    fixture.componentRef.setInput('bankId', 'b1');
    fixture.componentRef.setInput('bankName', 'Banco Industrial');
    fixture.componentRef.setInput('lines', [
      { receipt: receipt('r1', 'b1', 300), amount: 120.5 },
      { receipt: receipt('r2', 'b1', 200), amount: 200 },
    ]);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    expect(comp.total()).toBe(320.5);
    comp.reference.set('BOL-9');
    comp.save();
    comp.save();
    const [first] = post.calls.argsFor(0);
    expect(first).toEqual(jasmine.objectContaining({
      bankId: 'b1',
      items: [{ movementId: 'r1', amount: 120.5 }, { movementId: 'r2', amount: 200 }],
      reference: 'BOL-9',
    }));
    expect(post.calls.argsFor(1)[0].clientRequestId).toBe(first.clientRequestId);
  });
});

describe('SchoolCashCountModalComponent', () => {
  it('difference = counted − theoretical, and only counted denominations are sent', () => {
    const { cash } = setup(MANAGER);
    const post = spyOn(cash, 'registerCount').and.returnValue(of({ countNumber: 'ACL-1', difference: -49.99 }) as never);
    const fixture = TestBed.createComponent(SchoolCashCountModalComponent);
    fixture.componentRef.setInput('theoretical', 250);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    comp.onQuantity({ denomination: 200, quantity: 1 });
    comp.onQuantity({ denomination: 0.01, quantity: 1 });
    expect(comp.counted()).toBe(200.01);
    expect(comp.difference()).toBe(-49.99);
    expect(comp.resultLabel()).toBe('Faltante');
    comp.save();
    expect(post.calls.argsFor(0)[0].details).toEqual([
      { denomination: 200, quantity: 1 },
      { denomination: 0.01, quantity: 1 },
    ]);
  });
});

describe('SchoolCashExitModalComponent', () => {
  it('an exit never exceeds the cash, needs a reason, and a bank deposit needs its account', () => {
    const { cash } = setup(ADMIN);
    const post = spyOn(cash, 'registerExit').and.returnValue(of({}) as never);
    const fixture = TestBed.createComponent(SchoolCashExitModalComponent);
    fixture.componentRef.setInput('mode', 'SALIDA');
    fixture.componentRef.setInput('available', 100);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    expect(comp.banks().map((b) => b.id)).toEqual(['b1', 'b2']);
    comp.amount.set(150);
    expect(comp.problem()).toContain('solo tiene');
    comp.amount.set(80);
    comp.destination.set('DEPOSITO_BANCARIO');
    comp.reason.set('Depósito del día');
    expect(comp.problem()).toContain('cuenta');
    comp.bankId.set('b2');
    expect(comp.problem()).toBeNull();
    expect(comp.after()).toBe(20);
    comp.save();
    expect(post.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({ amount: 80, destination: 'DEPOSITO_BANCARIO', bankId: 'b2' }));
  });

  it('an adjustment sends its direction (entry may exceed the current cash)', () => {
    const { cash } = setup(ADMIN);
    const post = spyOn(cash, 'registerAdjustment').and.returnValue(of({}) as never);
    const fixture = TestBed.createComponent(SchoolCashExitModalComponent);
    fixture.componentRef.setInput('mode', 'AJUSTE');
    fixture.componentRef.setInput('available', 0);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    comp.amount.set(1000);
    comp.reason.set('Saldo inicial contado');
    expect(comp.problem()).toBeNull();
    comp.save();
    expect(post.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({ direction: 'IN', amount: 1000 }));
  });
});

describe('SchoolCashReportsComponent', () => {
  it('loads the catalog and the first report, and exports PDF and Excel from the backend', () => {
    const { cash } = setup(MANAGER);
    spyOn(cash, 'getReports').and.returnValue(of([{ kind: 'recaudacion-diaria', title: 'Recaudación diaria', description: '', usesRange: true }]));
    spyOn(cash, 'getReport').and.returnValue(
      of({
        kind: 'recaudacion-diaria', title: 'Recaudación diaria', description: '', usesRange: true,
        dateFrom: '2026-11-01', dateTo: '2026-11-19', periodLabel: '01/11/2026 al 19/11/2026', cashBalance: 10,
        columns: [{ key: 'day', label: 'Fecha', type: 'date', total: false }, { key: 'net', label: 'Neto', type: 'money', total: true }],
        rows: [{ day: '2026-11-18', net: 140 }],
        totals: { net: 140 },
      }),
    );
    const exportSpy = spyOn(cash, 'exportReport').and.returnValue(of(new Blob(['x'])));
    const fixture = TestBed.createComponent(SchoolCashReportsComponent);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('tbody')?.textContent).toContain('18/11/2026');
    expect(html.querySelector('tfoot')?.textContent).toContain('140.00');
    fixture.componentInstance.download('xlsx');
    expect(exportSpy.calls.argsFor(0)[1]).toBe('xlsx');
  });
});

describe('SchoolPaymentModalComponent — Caja de Listas', () => {
  it('a transfer cannot be saved without its bank and credit lines are not offered', () => {
    setup(['school_lists.view', 'school_lists.payments.register']);
    const fixture = TestBed.createComponent(SchoolPaymentModalComponent);
    const modal = fixture.componentInstance;
    fixture.componentRef.setInput('quotation', { id: 'q1', quotationNumber: 'LE-1', balance: 500 } as unknown as SchoolQuotation);
    modal.ngOnChanges({ quotation: {} as never });
    expect(modal.bankList().map((b) => b.id)).toEqual(['b1', 'b2']);
    modal.amount.set(100);
    modal.method.set('TRANSFERENCIA');
    expect(modal.canSave()).toBeFalse();
    modal.bankId.set('b1');
    expect(modal.canSave()).toBeTrue();
    expect(modal.destination()).toContain('Banco Industrial');
    modal.method.set('EFECTIVO');
    expect(modal.destination()).toContain('Caja de Listas');
  });
});

describe('Caja de Listas — cajeros y estados de cuenta', () => {
  const CASHIER: SchoolListPermission[] = [
    'school_lists.view',
    'school_lists.payments.register',
    'school_lists.customers.view',
    'school_lists.customers.export',
  ];

  it('a cashier only gets the Clientes tab and never loads the caja summary', () => {
    const { cash } = setup(CASHIER);
    const load = spyOn(cash, 'getSummary').and.returnValue(of(summary()));
    spyOn(cash, 'getCustomers').and.returnValue(
      of({ items: [], total: 0, page: 1, limit: 20, totals: { customers: 0, purchased: 0, paid: 0, balance: 0, byStatus: { SOLVENTE: 0, ABONANDO: 0, PENDIENTE: 0, CANCELADO: 0 } } }),
    );
    const fixture = TestBed.createComponent(SchoolCashBoxPageComponent);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance.activeTab()).toBe('clientes');
    expect(load).not.toHaveBeenCalled();
    expect(html.querySelector('.hero__balance')).toBeNull();
    expect(html.querySelector('app-school-cash-customers')).not.toBeNull();
  });
});

const customerRow = {
  key: '55551234', name: 'María López', phone: '5555-1234', otherNames: ['Maria Lopez'], students: ['Ana López', 'Juan López'],
  grades: ['Primero Básico', 'Tercero Básico'], quotationNumbers: ['LE-000001', 'LE-000002'], lists: 2, activeLists: 2,
  purchased: 1450, paid: 500, balance: 950, status: 'ABONANDO' as const, lastPaymentAt: '2026-11-19T16:00:00Z',
  firstAt: '2026-11-10T15:00:00Z', nextDeliveryDate: null,
};

describe('SchoolCashCustomersComponent', () => {
  it('searches in real time (debounced) and sends the filters to the backend', fakeAsync(() => {
    const { cash } = setup(MANAGER);
    spyOn(TestBed.inject(SchoolListService), 'getTemplates').and.returnValue(of([]));
    const get = spyOn(cash, 'getCustomers').and.returnValue(
      of({ items: [customerRow], total: 1, page: 1, limit: 20, totals: { customers: 1, purchased: 1450, paid: 500, balance: 950, byStatus: { SOLVENTE: 0, ABONANDO: 1, PENDIENTE: 0, CANCELADO: 0 } } }),
    );
    const fixture = TestBed.createComponent(SchoolCashCustomersComponent);
    fixture.componentRef.setInput('view', 'WITH_BALANCE');
    fixture.detectChanges();
    expect(get.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ view: 'WITH_BALANCE', sort: 'BALANCE' }));
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('María López');
    expect(html.textContent).toContain('Abonando');
    fixture.componentInstance.typed('Ana');
    fixture.componentInstance.typed('Ana Lo');
    tick(350);
    expect(get.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ search: 'Ana Lo', page: 1 }));
  }));
});

describe('SchoolCashCustomerPageComponent', () => {
  const statement = {
    customer: { ...customerRow, percentPaid: 34.5, statusLabel: 'Abonando' },
    lists: [
      { id: 'q1', quotationNumber: 'LE-000001', studentName: 'Juan López', grade: 'Primero Básico', quotationDate: '2026-11-10', deliveryDate: null, status: 'ACEPTADA', statusLabel: 'Aceptada', accountStatus: 'PARCIAL', total: 800, paid: 500, balance: 300, itemCount: 5, createdAt: '2026-11-10T15:00:00Z' },
      { id: 'q2', quotationNumber: 'LE-000002', studentName: 'Ana López', grade: 'Tercero Básico', quotationDate: '2026-11-11', deliveryDate: null, status: 'ACEPTADA', statusLabel: 'Aceptada', accountStatus: 'PENDIENTE', total: 650, paid: 0, balance: 650, itemCount: 4, createdAt: '2026-11-11T15:00:00Z' },
    ],
    payments: [],
    ledger: { opening: 0, rows: [], totalCharges: 1450, totalCredits: 500, closing: 950, officialBalance: 950, consistent: true },
  };

  function open(permissions: SchoolListPermission[]) {
    TestBed.overrideProvider(ActivatedRoute, { useValue: { snapshot: { paramMap: convertToParamMap({ key: '55551234' }) } } });
    const { cash } = setup(permissions);
    spyOn(cash, 'getCustomer').and.returnValue(of(statement) as never);
    const fixture = TestBed.createComponent(SchoolCashCustomerPageComponent);
    fixture.detectChanges();
    return { fixture, cash };
  }

  it('shows the file and asks which list an abono goes to when there are several', () => {
    const { fixture } = open(['school_lists.view', 'school_lists.customers.view', 'school_lists.payments.register']);
    const comp = fixture.componentInstance;
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelector('h1')?.textContent).toContain('María López');
    expect(html.textContent).toContain('Juan López');
    expect(html.textContent).toContain('34.5%');
    expect(comp.payable().length).toBe(2);
    comp.registerPayment();
    expect(comp.choosing()).toBeTrue();
    expect(comp.paying()).toBeNull();
    comp.pay(comp.payable()[1]);
    expect(comp.paying()).toEqual(jasmine.objectContaining({ id: 'q2', quotationNumber: 'LE-000002', balance: 650 }));
    // No print button without the export permission.
    expect(html.textContent).not.toContain('Ver / imprimir');
  });

  it('a role without customers.view sees nothing', () => {
    const { fixture, cash } = open(['school_lists.view']);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('no puede consultar');
    expect(cash.getCustomer).not.toHaveBeenCalled();
  });
});

