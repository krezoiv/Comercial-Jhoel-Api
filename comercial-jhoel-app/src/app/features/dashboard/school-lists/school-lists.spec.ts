import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import {
  Product,
  SchoolListPermission,
  SchoolQuotation,
  SchoolTemplate,
  SchoolTemplateSummary,
  canReceiveSchoolPayment,
  formatSchoolDate,
  isSchoolQuotationEditable,
} from '../../../core/models';
import { BankService } from '../../../core/services/bank.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { SchoolListService } from '../../../core/services/school-list.service';
import { SchoolDashboardComponent, buildIncomePoints, eachDay } from './components/school-dashboard/school-dashboard.component';
import { SchoolPaymentModalComponent } from './components/school-payment-modal/school-payment-modal.component';
import {
  EditorLine,
  SchoolQuotationEditorComponent,
  lineError,
  lineSubtotal,
} from './components/school-quotation-editor/school-quotation-editor.component';
import { SchoolQuotationsListComponent } from './components/school-quotations-list/school-quotations-list.component';
import { SchoolTemplatesComponent } from './components/school-templates/school-templates.component';

const summary: SchoolTemplateSummary = {
  id: 't1',
  name: 'Primero Básico',
  grade: 'Primero Básico',
  description: null,
  isActive: true,
  sortOrder: 10,
  version: 2,
  itemCount: 2,
  total: 55,
  updatedAt: '2099-01-01T00:00:00Z',
  updatedByUsername: 'admin',
};

const template: SchoolTemplate = {
  ...summary,
  items: [
    { id: 'ti1', lineNo: 1, productId: null, productName: 'Cuaderno mediano', description: null, quantity: 3, unitPrice: 15, subtotal: 45, observations: null, inventoryPrice: null },
    { id: 'ti2', lineNo: 2, productId: null, productName: 'Lápiz', description: null, quantity: 5, unitPrice: 2, subtotal: 10, observations: null, inventoryPrice: null },
  ],
};

const quotation = (over: Partial<SchoolQuotation> = {}): SchoolQuotation => ({
  id: 'q1',
  quotationNumber: 'LE-000001',
  quotationDate: '2099-01-10',
  deliveryDate: null,
  customerName: 'María López',
  customerPhone: '5555-1234',
  studentName: null,
  grade: 'Primero Básico',
  templateId: 't1',
  templateName: 'Primero Básico',
  total: 850,
  paid: 300,
  balance: 550,
  status: 'ANTICIPO_RECIBIDO',
  accountStatus: 'PARCIAL',
  version: 3,
  createdAt: '2099-01-10T15:00:00Z',
  createdByUsername: 'cajero',
  subtotal: 850,
  discount: 0,
  observations: null,
  updatedAt: '2099-01-10T15:00:00Z',
  deliveredAt: null,
  deliveredByUsername: null,
  cancelledAt: null,
  cancelledByUsername: null,
  cancelReason: null,
  items: [],
  payments: [],
  history: [],
  account: { total: 850, advances: 300, installments: 0, refunds: 0, paid: 300, balance: 550 },
  ...over,
});

const product = { id: 'p1', name: 'Cuaderno grande', publicPrice: 25 } as Product;

function setup(permissions: SchoolListPermission[]): SchoolListService {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true) } },
      { provide: BankService, useValue: { getBanks: () => of([]) } },
    ],
  });
  const service = TestBed.inject(SchoolListService);
  const granted = new Set(permissions);
  spyOn(service, 'can').and.callFake((p: SchoolListPermission) => granted.has(p));
  spyOn(service, 'getTemplates').and.returnValue(of([summary]));
  spyOn(service, 'getTemplate').and.returnValue(of(template));
  return service;
}

const CASHIER: SchoolListPermission[] = [
  'school_lists.view',
  'school_lists.quotations.create',
  'school_lists.quotations.edit',
  'school_lists.payments.register',
  'school_lists.statements.view',
  'school_lists.documents.generate',
];

describe('Listas Escolares — helpers', () => {
  it('computes line subtotals and validates lines like the backend', () => {
    const line = { quantity: 3, unitPrice: 15, discount: 5 } as EditorLine;
    expect(lineSubtotal(line)).toBe(40);
    const ok = { productName: 'Lápiz', quantity: 2, unitPrice: 2.5, discount: 0 } as EditorLine;
    expect(lineError(ok)).toBeNull();
    expect(lineError({ ...ok, quantity: 1.5 })).toContain('entero');
    expect(lineError({ ...ok, unitPrice: 1.005 })).toBe('Precio no válido.');
    expect(lineError({ ...ok, discount: 6 })).toContain('descuento');
    expect(lineError({ ...ok, productName: ' ' })).toContain('nombre');
  });

  it('builds daily income points (zero-filled) or monthly ones for long ranges', () => {
    expect(eachDay('2099-02-27', '2099-03-02')).toEqual(['2099-02-27', '2099-02-28', '2099-03-01', '2099-03-02']);
    const daily = buildIncomePoints({
      dateFrom: '2099-03-01',
      dateTo: '2099-03-03',
      incomeByDay: [{ date: '2099-03-02', amount: 150 }],
    } as never);
    expect(daily.map((p) => p.value)).toEqual([0, 150, 0]);
    const monthly = buildIncomePoints({
      dateFrom: '2099-01-01',
      dateTo: '2099-04-30',
      incomeByDay: [
        { date: '2099-01-05', amount: 100 },
        { date: '2099-01-20', amount: 50 },
        { date: '2099-03-02', amount: 20 },
      ],
    } as never);
    expect(monthly.map((p) => `${p.label}:${p.value}`)).toEqual(['ene:150', 'feb:0', 'mar:20', 'abr:0']);
  });

  it('edit and payment rules by status', () => {
    expect(isSchoolQuotationEditable('PAGADA')).toBeTrue();
    expect(isSchoolQuotationEditable('ENTREGADA')).toBeFalse();
    expect(canReceiveSchoolPayment('BORRADOR')).toBeFalse();
    expect(canReceiveSchoolPayment('EN_PREPARACION')).toBeTrue();
    expect(canReceiveSchoolPayment('CANCELADA')).toBeFalse();
    expect(formatSchoolDate('2099-03-01')).toBe('01/03/2099');
  });
});

describe('SchoolListService', () => {
  it('loads permissions once and exposes them through can()', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const service = TestBed.inject(SchoolListService);
    const http = TestBed.inject(HttpTestingController);
    service.loadPermissions().subscribe();
    http
      .expectOne(`${environment.apiUrl}/school-lists/permissions`)
      .flush({ success: true, data: { permissions: ['school_lists.view'] } });
    expect(service.permissionsLoaded()).toBeTrue();
    expect(service.can('school_lists.view')).toBeTrue();
    expect(service.can('school_lists.templates.manage')).toBeFalse();
    http.verify();
  });

  it('sends filters as query params and the payment with its clientRequestId', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const service = TestBed.inject(SchoolListService);
    const http = TestBed.inject(HttpTestingController);
    service.getQuotations({ phone: '5555', status: '', grade: 'Primero Básico', page: 2 }).subscribe();
    const list = http.expectOne((r) => r.url === `${environment.apiUrl}/school-lists/quotations`);
    expect(list.request.params.get('phone')).toBe('5555');
    expect(list.request.params.has('status')).toBeFalse();
    expect(list.request.params.get('page')).toBe('2');
    list.flush({ success: true, data: { items: [], total: 0, page: 2, limit: 20 } });

    service.registerPayment('q1', { amount: 150, paymentMethod: 'EFECTIVO' }, 'req-123456').subscribe();
    const pay = http.expectOne(`${environment.apiUrl}/school-lists/quotations/q1/payments`);
    expect(pay.request.body).toEqual({ amount: 150, paymentMethod: 'EFECTIVO', clientRequestId: 'req-123456' });
    pay.flush({ success: true, data: { paymentId: 'p', quotation: quotation() } });
    http.verify();
  });
});

describe('SchoolQuotationEditorComponent', () => {
  it('loads the grade template, customizes the copy and sends it with the anticipo', async () => {
    const service = setup(CASHIER);
    const create = spyOn(service, 'createQuotation').and.returnValue(of(quotation()));
    const editor = TestBed.createComponent(SchoolQuotationEditorComponent).componentInstance;

    await editor.selectTemplate(summary);
    expect(editor.lines().map((l) => l.source)).toEqual(['PLANTILLA', 'PLANTILLA']);
    expect(editor.total()).toBe(55);

    // "Cuaderno mediano" → inventory "Cuaderno grande"; the template object is untouched.
    editor.replaceWith(editor.lines()[0].key, product);
    editor.addManual();
    const manual = editor.lines()[2];
    editor.update(manual.key, { productName: 'Juego geométrico' });
    editor.setNumber(manual.key, 'unitPrice', '18');
    expect(template.items[0].productName).toBe('Cuaderno mediano');
    expect(editor.total()).toBe(3 * 25 + 10 + 18);
    // A cashier cannot change reference prices; free-text lines are priced freely.
    expect(editor.priceEditable(editor.lines()[1])).toBeFalse();
    expect(editor.priceEditable(manual)).toBeTrue();

    editor.customerName.set('María López');
    editor.customerPhone.set('5555-1234');
    editor.toggleAdvance(true);
    editor.advanceAmount.set(50);
    expect(editor.balance()).toBe(103 - 50);
    expect(editor.problems()).toEqual([]);

    await editor.save();
    const input = create.calls.mostRecent().args[0];
    expect(input.templateId).toBe('t1');
    expect(input.items[0]).toEqual(jasmine.objectContaining({ productId: 'p1', templateItemId: null, quantity: 3, unitPrice: 25 }));
    expect(input.items[1].templateItemId).toBe('ti2');
    expect(input.advance).toEqual(jasmine.objectContaining({ amount: 50, paymentMethod: 'EFECTIVO' }));
    expect(input.clientRequestId).toBeTruthy();
  });

  it('keeps the same clientRequestId when a save fails and is retried', async () => {
    const service = setup(CASHIER);
    const create = spyOn(service, 'createQuotation').and.returnValues(
      throwError(() => new HttpErrorResponse({ status: 0 })),
      of(quotation()),
    );
    const editor = TestBed.createComponent(SchoolQuotationEditorComponent).componentInstance;
    await editor.selectTemplate(summary);
    editor.customerName.set('María López');
    editor.customerPhone.set('5555-1234');
    await editor.save();
    expect(editor.error()).toBeTruthy();
    await editor.save();
    expect(create.calls.argsFor(0)[0].clientRequestId).toBe(create.calls.argsFor(1)[0].clientRequestId);
  });

  it('blocks saving without phone, grade or products and never below what was paid', () => {
    setup(CASHIER);
    const fixture = TestBed.createComponent(SchoolQuotationEditorComponent);
    const editor = fixture.componentInstance;
    expect(editor.problems()).toEqual(
      jasmine.arrayContaining([jasmine.stringContaining('teléfono'), jasmine.stringContaining('grado')]),
    );
    fixture.componentRef.setInput('quotation', quotation({
      items: [{ id: 'i1', lineNo: 1, source: 'MANUAL', templateItemId: null, productId: null, productName: 'Paquete', description: null, quantity: 1, unitPrice: 850, discount: 0, subtotal: 850, observations: null }],
    }));
    editor.ngOnChanges({ quotation: {} as never });
    editor.setNumber(editor.lines()[0].key, 'unitPrice', 100);
    expect(editor.isEdit()).toBeTrue();
    expect(editor.problems()).toEqual([`El total no puede ser menor a lo ya pagado (${editor.formatCurrency(300)}).`]);
  });
});

describe('SchoolPaymentModalComponent', () => {
  it('rejects payments above the balance and reuses its request id on retry', async () => {
    const service = setup(CASHIER);
    const pay = spyOn(service, 'registerPayment').and.returnValues(
      throwError(() => new HttpErrorResponse({ status: 0 })),
      of({ paymentId: 'p2', quotation: quotation() }),
    );
    const fixture = TestBed.createComponent(SchoolPaymentModalComponent);
    const modal = fixture.componentInstance;
    fixture.componentRef.setInput('quotation', quotation());
    modal.ngOnChanges({ quotation: {} as never });

    modal.amount.set(550.01);
    expect(modal.canSave()).toBeFalse();
    expect(modal.amountError()).toContain('saldo');
    modal.amount.set(-1);
    expect(modal.canSave()).toBeFalse();
    modal.payAll();
    expect(modal.after()).toBe(0);
    expect(modal.canSave()).toBeTrue();

    const emitted: string[] = [];
    modal.paid.subscribe((r) => emitted.push(r.paymentId));
    await modal.save();
    await modal.save();
    expect(pay.calls.argsFor(0)[2]).toBe(pay.calls.argsFor(1)[2]);
    expect(emitted).toEqual(['p2']);
  });
});

describe('Listas Escolares — role-based actions', () => {
  it('a cashier sees no template administration', () => {
    setup(CASHIER);
    const fixture = TestBed.createComponent(SchoolTemplatesComponent);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Primero Básico');
    expect(html.textContent).not.toContain('Nueva plantilla');
    expect(html.querySelector('[aria-label="Editar plantilla"]')).toBeNull();
  });

  it('an administrator can create, edit, duplicate and deactivate templates', () => {
    setup([...CASHIER, 'school_lists.templates.manage']);
    const fixture = TestBed.createComponent(SchoolTemplatesComponent);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Nueva plantilla');
    expect(html.querySelector('[aria-label="Editar plantilla"]')).not.toBeNull();
    expect(html.querySelector('[aria-label="Duplicar plantilla"]')).not.toBeNull();
  });

  it('the list hides payment and edit actions without permission', () => {
    const service = setup(['school_lists.view', 'school_lists.statements.view']);
    spyOn(service, 'getQuotations').and.returnValue(of({ items: [quotation()], total: 1, page: 1, limit: 20 }));
    const fixture = TestBed.createComponent(SchoolQuotationsListComponent);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('LE-000001');
    expect(html.querySelector('[aria-label="Registrar abono"]')).toBeNull();
    expect(html.querySelector('[aria-label="Editar cotización"]')).toBeNull();
    expect(html.querySelector('[aria-label="Ver detalle"]')).not.toBeNull();
  });

  it('the dashboard renders the backend figures', () => {
    const service = setup(CASHIER);
    spyOn(service, 'getDashboard').and.returnValue(
      of({
        dateFrom: '2099-01-01',
        dateTo: '2099-01-31',
        totalQuotations: 4,
        pendingQuotations: 2,
        paidQuotations: 1,
        totalQuoted: 3400,
        totalReceived: 1200,
        pendingBalance: 2200,
        byGrade: [{ grade: 'Primero Básico', count: 4, total: 3400 }],
        byStatus: [],
        incomeByDay: [{ date: '2099-01-10', amount: 1200 }],
      }),
    );
    const fixture = TestBed.createComponent(SchoolDashboardComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.gradeSegments()).toEqual([jasmine.objectContaining({ label: 'Primero Básico', value: 4 })]);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Saldo pendiente por cobrar');
  });
});
