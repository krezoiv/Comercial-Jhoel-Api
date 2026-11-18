import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import {
  Product,
  SchoolCatalogProduct,
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
import { SchoolQuotationSupplyComponent } from './components/school-quotation-supply/school-quotation-supply.component';
import { SchoolSupplyComponent } from './components/school-supply/school-supply.component';
import { ProductSwapResult, SchoolProductSwapModalComponent } from './components/school-product-swap-modal/school-product-swap-modal.component';
import { CategoryService } from '../../../core/services/category.service';
import { consolidateLines, findDuplicateLine, swapLineProduct } from './school-line-rules';

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
    { id: 'ti1', lineNo: 1, productId: null, productName: 'Cuaderno mediano', description: null, quantity: 3, unitPrice: 15, subtotal: 45, observations: null, inventoryPrice: null, productSku: null, categoryId: null, categoryName: null },
    { id: 'ti2', lineNo: 2, productId: null, productName: 'Lápiz', description: null, quantity: 5, unitPrice: 2, subtotal: 10, observations: null, inventoryPrice: null, productSku: null, categoryId: null, categoryName: null },
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
  advance: 300,
  paid: 300,
  balance: 550,
  status: 'ANTICIPO_RECIBIDO',
  accountStatus: 'PARCIAL',
  supplyStatus: 'PARCIAL',
  version: 3,
  createdAt: '2099-01-10T15:00:00Z',
  createdByUsername: 'cajero',
  subtotal: 850,
  discount: 0,
  observations: null,
  updatedAt: '2099-01-10T15:00:00Z',
  finishedAt: null,
  finishedByUsername: null,
  deliveredAt: null,
  deliveredByUsername: null,
  cancelledAt: null,
  cancelledByUsername: null,
  cancelReason: null,
  items: [],
  payments: [],
  history: [],
  inventory: [],
  supply: { status: 'PARCIAL', confirmedAt: null, lines: [], uncontrolledLines: 0, allocations: [], dispatch: null },
  account: { total: 850, advances: 300, installments: 0, refunds: 0, paid: 300, balance: 550 },
  ...over,
});

const product = { id: 'p1', name: 'Cuaderno grande', publicPrice: 25, sku: 'CU-G', category: 'Cuadernos y libretas', categoryId: 'c1' } as Product;
/** The same product as the change-product catalog returns it. */
const catalogProduct = (over: Partial<SchoolCatalogProduct> = {}): SchoolCatalogProduct => ({
  id: 'p1',
  name: 'Cuaderno grande',
  sku: 'CU-G',
  categoryId: 'c1',
  categoryName: 'Cuadernos y libretas',
  publicPrice: 25,
  ...over,
});

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
  spyOn(service, 'bodegaStock').and.returnValue(of([{ productId: 'p1', quantity: 2 }]));
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

    // "Cuaderno mediano" → inventory "Cuaderno grande" (keeps the quantity); the template object is untouched.
    editor.onSwapped(editor.lines()[0].key, { request: { product: catalogProduct(), quantity: 3, unitPrice: 25 }, consolidateWith: null });
    expect(editor.lines()[0]).toEqual(jasmine.objectContaining({ categoryName: 'Cuadernos y libretas', sku: 'CU-G', source: 'INVENTARIO' }));
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
      items: [{ id: 'i1', lineNo: 1, source: 'MANUAL', templateItemId: null, productId: null, productName: 'Paquete', description: null, quantity: 1, unitPrice: 850, discount: 0, subtotal: 850, observations: null, productSku: null, categoryId: null, categoryName: null }],
    }));
    editor.ngOnChanges({ quotation: {} as never });
    editor.setNumber(editor.lines()[0].key, 'unitPrice', 100);
    expect(editor.isEdit()).toBeTrue();
    expect(editor.problems()).toEqual([`El total no puede ser menor a lo ya pagado (${editor.formatCurrency(300)}).`]);
  });
});

describe('SchoolQuotationEditorComponent — inventario de Bodega', () => {
  async function editorWithProduct(quantity: number, asDraft = false) {
    const service = setup(CASHIER);
    const confirm = TestBed.inject(ConfirmDialogService);
    const confirmSpy = spyOn(confirm, 'confirm').and.returnValue(Promise.resolve(true));
    const create = spyOn(service, 'createQuotation').and.returnValue(of(quotation()));
    const fixture = TestBed.createComponent(SchoolQuotationEditorComponent);
    const editor = fixture.componentInstance;
    await editor.selectTemplate(summary);
    editor.addProduct(product);
    editor.setNumber(editor.lines()[2].key, 'quantity', quantity);
    editor.customerName.set('María López');
    editor.customerPhone.set('5555-1234');
    editor.asDraft.set(asDraft);
    fixture.detectChanges(); // runs the effect that loads Bodega stock
    return { editor, create, confirmSpy, fixture };
  }

  it('shows Bodega stock and warns, but never blocks, when it is not enough', async () => {
    const { editor, create, confirmSpy, fixture } = await editorWithProduct(3);
    expect(editor.available('p1')).toBe(2);
    expect(editor.shortProducts()).toEqual(['Cuaderno grande']);
    expect(editor.problems()).toEqual([]);
    expect((fixture.nativeElement as HTMLElement).querySelector('.stock--short')?.textContent).toContain('Bodega: 2');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.summary__info')?.textContent).toContain('Cuaderno grande');
    await editor.save();
    expect(confirmSpy.calls.mostRecent().args[0].message!).toContain('podrán generar existencias negativas');
    expect(create).toHaveBeenCalled();
  });

  it('warns that inventory will be discounted (or not, for a draft) before saving', async () => {
    const { editor, confirmSpy } = await editorWithProduct(2);
    expect(editor.problems()).toEqual([]);
    await editor.save();
    const message = confirmSpy.calls.mostRecent().args[0].message!;
    expect(message).toContain('3 producto(s)');
    expect(message).toContain('se descontarán 2 unidad(es) de Bodega');
  });

  it('a draft does not take stock yet, so it is not blocked by Bodega', async () => {
    const draft = await editorWithProduct(5, true);
    expect(draft.editor.problems()).toEqual([]); // a draft does not take stock yet
    await draft.editor.save();
    expect(draft.confirmSpy.calls.mostRecent().args[0].message!).toContain('no descuenta inventario');
  });
});

describe('SchoolQuotationSupplyComponent (despacho)', () => {
  const line = { productId: 'p1', productName: 'Cuaderno', requested: 5, allocated: 5, pending: 0, delivered: 0 };

  function supplyFor(over: Partial<SchoolQuotation>) {
    const service = setup(CASHIER);
    const fixture = TestBed.createComponent(SchoolQuotationSupplyComponent);
    fixture.componentRef.setInput('quotation', quotation(over));
    fixture.detectChanges();
    return { service, fixture, component: fixture.componentInstance };
  }

  it('blocks dispatch while products are pending or money is owed', () => {
    const pending = supplyFor({
      status: 'PAGADA',
      balance: 0,
      supply: { status: 'PARCIAL', confirmedAt: null, lines: [{ ...line, allocated: 2, pending: 3 }], uncontrolledLines: 0, allocations: [], dispatch: null },
    }).component;
    expect(pending.canDispatch()).toBeFalse();
    expect(pending.blocker()).toContain('pendientes de abastecimiento');
  });

  it('dispatches once with a request id when supplied and paid', () => {
    const { service, component } = supplyFor({
      status: 'PAGADA',
      balance: 0,
      supply: { status: 'DISPONIBLE', confirmedAt: null, lines: [line], uncontrolledLines: 1, allocations: [], dispatch: null },
    });
    const dispatch = spyOn(service, 'dispatch').and.returnValue(of(quotation({ status: 'ENTREGADA' })));
    expect(component.canDispatch()).toBeTrue();
    component.open();
    component.observations.set('Entregada en mostrador');
    component.confirm();
    expect(dispatch).toHaveBeenCalledOnceWith('q1', 'Entregada en mostrador', jasmine.any(String));
    expect(component.dialog()).toBeFalse();
  });
});

describe('SchoolSupplyComponent (productos pendientes)', () => {
  it('shows pending vs negative stock and runs FIFO for a manager', async () => {
    const service = setup([...CASHIER, 'school_lists.supply.manage']);
    spyOn(service, 'supplySettings').and.returnValue(of({ allocationMode: 'FIFO_AUTO' as const }));
    spyOn(service, 'supplyPurchases').and.returnValue(of({ items: [], total: 0, page: 1, limit: 10 }));
    spyOn(service, 'supplyProducts').and.returnValue(
      of({
        items: [
          { productId: 'p1', productName: 'Cuaderno', sku: 'C-1', category: 'Útiles', bodega: -15, committed: 15, allocated: 0, pending: 15, freeUnits: 0, lists: 2, firstOrderAt: null, lastOrderAt: null, status: 'PENDIENTE' as const },
        ],
        total: 1,
        page: 1,
        limit: 15,
        summary: { pendingProducts: 1, pendingUnits: 15, affectedLists: 2, suppliedProducts: 0, partialProducts: 0 },
      }),
    );
    const fifo = spyOn(service, 'runFifo').and.returnValue(of({ allocated: 0 }));
    const fixture = TestBed.createComponent(SchoolSupplyComponent);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Productos pendientes de abastecimiento');
    expect(html.textContent).toContain('-15');
    expect(html.querySelector('[aria-label="Asignar FIFO"]')).not.toBeNull();
    await fixture.componentInstance.fifo();
    expect(fifo).toHaveBeenCalled();
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

  it('marks a quotation as TERMINADA from the list and only offers delivery once paid', async () => {
    const service = setup(CASHIER);
    spyOn(service, 'getQuotations').and.returnValue(of({ items: [quotation()], total: 1, page: 1, limit: 20 }));
    const change = spyOn(service, 'changeStatus').and.returnValue(of(quotation({ status: 'TERMINADA' })));
    const fixture = TestBed.createComponent(SchoolQuotationsListComponent);
    fixture.detectChanges();
    const list = fixture.componentInstance;
    const html = fixture.nativeElement as HTMLElement;
    const finishBtn = html.querySelector<HTMLButtonElement>('[aria-label="Marcar como terminada"]')!;
    expect(finishBtn.disabled).toBeFalse();
    expect(list.canDeliver(quotation({ status: 'TERMINADA', balance: 400 }))).toBeFalse();
    expect(list.canDeliver(quotation({ status: 'TERMINADA', balance: 0 }))).toBeFalse(); // still PARCIAL
    expect(list.canDeliver(quotation({ status: 'TERMINADA', balance: 0, supplyStatus: 'DISPONIBLE' }))).toBeTrue();
    expect(list.canFinish(quotation({ status: 'TERMINADA' }))).toBeFalse();
    expect(list.canFinish(quotation({ status: 'BORRADOR' }))).toBeFalse();
    await list.finish(quotation());
    expect(change).toHaveBeenCalledWith('q1', 'TERMINAR', 3);
  });

  it('the dashboard renders the backend figures', () => {
    const service = setup(CASHIER);
    spyOn(service, 'getDashboard').and.returnValue(
      of({
        dateFrom: '2099-01-01',
        dateTo: '2099-01-31',
        totalQuotations: 4,
        awaitingQuotations: 1,
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

// ── Categories and "Cambiar producto" ──────────────────────────────────────
const line = (over: Partial<EditorLine> = {}): EditorLine => ({
  key: 'l1',
  itemId: null,
  templateItemId: null,
  productId: 'p0',
  productName: 'Cuaderno mediano',
  sku: 'CU-M',
  categoryId: 'c1',
  categoryName: 'Cuadernos y libretas',
  description: '',
  quantity: 5,
  unitPrice: 12,
  discount: 1,
  observations: 'Forrado',
  source: 'PLANTILLA',
  referencePrice: 12,
  ...over,
});

describe('Listas Escolares — reglas de líneas (cambiar producto)', () => {
  it('swaps the product keeping key, position, quantity and observation; takes the real category', () => {
    const lines = [line(), line({ key: 'l2', productId: 'p9', productName: 'Lápiz' })];
    const next = swapLineProduct(lines, 'l1', { product: catalogProduct(), quantity: 5, unitPrice: 25 });
    expect(next.map((l) => l.key)).toEqual(['l1', 'l2']);
    expect(next[0]).toEqual(
      jasmine.objectContaining({
        productId: 'p1',
        productName: 'Cuaderno grande',
        sku: 'CU-G',
        categoryId: 'c1',
        categoryName: 'Cuadernos y libretas',
        quantity: 5,
        unitPrice: 25,
        discount: 0,
        observations: 'Forrado',
        source: 'INVENTARIO',
        itemId: null,
        templateItemId: null,
      }),
    );
    // Prices and subtotals: 5 × Q25.00.
    expect(lineSubtotal(next[0])).toBe(125);
    expect(lines[0].productName).toBe('Cuaderno mediano'); // pure: input untouched
  });

  it('detects a duplicate and consolidates quantities instead of duplicating the product', () => {
    const lines = [line(), line({ key: 'l2', productId: 'p1', productName: 'Cuaderno grande', quantity: 2 })];
    expect(findDuplicateLine(lines, 'p1', 'l1')?.key).toBe('l2');
    expect(findDuplicateLine(lines, 'p1', 'l2')).toBeNull();
    const merged = consolidateLines(lines, 'l1', 'l2', 5);
    expect(merged.length).toBe(1);
    expect(merged[0]).toEqual(jasmine.objectContaining({ key: 'l2', productId: 'p1', quantity: 7 }));
    expect(consolidateLines(lines, 'l1', 'l2', 99999)[0].quantity).toBe(9999);
    expect(consolidateLines(lines, 'l1', 'missing', 1).length).toBe(2);
  });
});

describe('SchoolProductSwapModalComponent', () => {
  const page = (items: SchoolCatalogProduct[]) => of({ items, total: items.length, page: 1, limit: 12 });

  function open(permissions: SchoolListPermission[] = CASHIER) {
    // Real active categories come from CategoryService (GET /categories); stubbed here.
    TestBed.overrideProvider(CategoryService, {
      useValue: {
        getCategories: () =>
          of([
            { id: 'c1', name: 'Cuadernos y libretas', isActive: true },
            { id: 'c2', name: 'Geometría', isActive: true },
          ]),
      },
    });
    const service = setup(permissions);
    const catalog = spyOn(service, 'catalogProducts').and.callFake((filters) =>
      page(
        filters.categoryId === 'c2'
          ? [catalogProduct({ id: 'p7', name: 'Regla de 30 cm', categoryId: 'c2', categoryName: 'Geometría', publicPrice: 5 })]
          : [catalogProduct(), catalogProduct({ id: 'p0', name: 'Cuaderno mediano', publicPrice: 12 })],
      ),
    );
    const fixture = TestBed.createComponent(SchoolProductSwapModalComponent);
    const modal = fixture.componentInstance;
    return { service, catalog, fixture, modal };
  }

  function show(fixture: ReturnType<typeof open>['fixture'], current: EditorLine, lines: EditorLine[] = [current], canOverride = false) {
    fixture.componentRef.setInput('lines', lines);
    fixture.componentRef.setInput('canOverride', canOverride);
    fixture.componentRef.setInput('line', current);
    fixture.detectChanges();
  }

  it('opens on the category of the current product and lists only that category', () => {
    const { catalog, fixture, modal } = open();
    show(fixture, line());
    expect(modal.categoryId()).toBe('c1');
    expect(catalog.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ categoryId: 'c1', page: 1 }));
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Cambiar producto');
    expect(html.textContent).toContain('Cuadernos y libretas');
    expect(html.textContent).toContain('Cuaderno grande');
    // The product being replaced is shown but cannot be picked again.
    const current = [...html.querySelectorAll<HTMLButtonElement>('.product')].find((b) => b.textContent!.includes('Cuaderno mediano'))!;
    expect(current.disabled).toBeTrue();
  });

  it('switching category refreshes the results; search goes by name or SKU inside the category', fakeAsync(() => {
    const { catalog, fixture, modal } = open();
    show(fixture, line());
    modal.onCategory('c2');
    fixture.detectChanges();
    expect(catalog.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ categoryId: 'c2', page: 1 }));
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Regla de 30 cm');
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Cuaderno grande');

    const calls = catalog.calls.count();
    modal.onSearch('RG-30');
    expect(catalog.calls.count()).toBe(calls); // debounced
    tick(250);
    expect(catalog.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ categoryId: 'c2', search: 'RG-30' }));
  }));

  it('keeps the original quantity, uses the product price for a cashier and emits the swap', () => {
    const { fixture, modal } = open();
    show(fixture, line());
    const emitted: ProductSwapResult[] = [];
    modal.swapped.subscribe((r) => emitted.push(r));
    modal.select(catalogProduct());
    expect(modal.quantity()).toBe(5);
    modal.setPrice('1'); // ignored: the role cannot override prices
    modal.confirm();
    expect(emitted[0]).toEqual({ request: { product: catalogProduct(), quantity: 5, unitPrice: 25 }, consolidateWith: null });
  });

  it('an already listed product is consolidated, never duplicated', () => {
    const { fixture, modal } = open();
    const existing = line({ key: 'l2', productId: 'p1', productName: 'Cuaderno grande', quantity: 2 });
    show(fixture, line(), [line(), existing], true);
    modal.select(catalogProduct());
    fixture.detectChanges();
    expect(modal.duplicate()?.key).toBe('l2');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Consolidar cantidades');
    const emitted: ProductSwapResult[] = [];
    modal.swapped.subscribe((r) => emitted.push(r));
    modal.confirm();
    expect(emitted[0].consolidateWith).toBe('l2');
  });

  it('validates the quantity before confirming', () => {
    const { fixture, modal } = open();
    show(fixture, line());
    modal.select(catalogProduct());
    modal.setQuantity('0');
    expect(modal.canConfirm()).toBeFalse();
    modal.setQuantity('2.5');
    expect(modal.quantityError()).toContain('entero');
    modal.setQuantity('3');
    expect(modal.canConfirm()).toBeTrue();
  });
});

describe('SchoolQuotationEditorComponent — categorías y cambio de producto', () => {
  it('shows each line category from the backend and swaps without touching inventory or the API', async () => {
    const service = setup(CASHIER);
    const create = spyOn(service, 'createQuotation');
    const update = spyOn(service, 'updateQuotation');
    const fixture = TestBed.createComponent(SchoolQuotationEditorComponent);
    const editor = fixture.componentInstance;
    fixture.componentRef.setInput(
      'quotation',
      quotation({
        items: [
          { id: 'i1', lineNo: 1, source: 'INVENTARIO', templateItemId: null, productId: 'p0', productName: 'Cuaderno mediano', description: null, quantity: 5, unitPrice: 12, discount: 0, subtotal: 60, observations: null, productSku: 'CU-M', categoryId: 'c1', categoryName: 'Cuadernos y libretas' },
          { id: 'i2', lineNo: 2, source: 'MANUAL', templateItemId: null, productId: null, productName: 'Forro', description: null, quantity: 2, unitPrice: 1.5, discount: 0, subtotal: 3, observations: null, productSku: null, categoryId: null, categoryName: null },
        ],
      }),
    );
    fixture.componentRef.setInput('swapItemId', 'i1');
    editor.ngOnChanges({ quotation: {} as never });
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    const badges = [...html.querySelectorAll('.lines .cat-badge')].map((b) => b.textContent!.trim());
    expect(badges).toEqual(['Cuadernos y libretas', 'Sin categoría']);
    // ?cambiar=i1 opened the modal on that line.
    expect(editor.replacing()?.itemId).toBe('i1');

    const total = editor.total();
    editor.onSwapped(editor.replacingKey()!, { request: { product: catalogProduct(), quantity: 5, unitPrice: 25 }, consolidateWith: null });
    expect(editor.replacingKey()).toBeNull();
    expect(editor.lines()[0]).toEqual(jasmine.objectContaining({ productId: 'p1', quantity: 5, itemId: null }));
    expect(editor.total()).toBe(total - 60 + 125);
    // Nothing is sent (and nothing moves in Bodega) until the user saves.
    expect(create).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    // Every row carries labels for the phone card layout.
    expect(html.querySelectorAll('.lines td[data-label="Producto"]').length).toBe(2);
  });

  it('consolidates into the existing line when the product is already listed', () => {
    setup(CASHIER);
    const editor = TestBed.createComponent(SchoolQuotationEditorComponent).componentInstance;
    editor.addProduct(product); // Cuaderno grande × 1
    editor.addManual();
    const manual = editor.lines()[1];
    editor.onSwapped(manual.key, { request: { product: catalogProduct(), quantity: 4, unitPrice: 25 }, consolidateWith: editor.lines()[0].key });
    expect(editor.lines().length).toBe(1);
    expect(editor.lines()[0]).toEqual(jasmine.objectContaining({ productId: 'p1', quantity: 5 }));
  });
});

describe('SchoolQuotationsListComponent — resumen y orden', () => {
  it('builds the summary cards from the backend and sorts through the API', () => {
    const service = setup(CASHIER);
    spyOn(service, 'getDashboard').and.returnValue(
      of({
        dateFrom: '2099-01-01',
        dateTo: '2099-12-31',
        totalQuotations: 9,
        awaitingQuotations: 3,
        pendingQuotations: 4,
        paidQuotations: 2,
        totalQuoted: 5400,
        totalReceived: 1200,
        pendingBalance: 4200,
        byGrade: [],
        byStatus: [],
        incomeByDay: [],
      }),
    );
    const get = spyOn(service, 'getQuotations').and.returnValue(of({ items: [quotation()], total: 1, page: 1, limit: 20 }));
    const fixture = TestBed.createComponent(SchoolQuotationsListComponent);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    const card = (i: number) => {
      const el = html.querySelectorAll('.kpi')[i];
      return `${el.querySelector('.kpi__label')!.textContent} = ${el.querySelector('.kpi__value')!.textContent}`;
    };
    expect(html.querySelectorAll('.kpi').length).toBe(5);
    expect(card(0)).toBe('Total de cotizaciones = 9');
    expect(card(1)).toBe('Pendientes = 3');
    expect(card(2)).toBe('Pagadas = 2');
    expect(card(3)).toBe('Con saldo pendiente = 4');
    expect(card(4)).toBe('Total cotizado = Q 5,400.00');
    // Status pill with the color of its status, and the anticipo column.
    expect(html.querySelector('.status-pill--purple')?.textContent).toContain('Anticipo recibido');
    expect(html.querySelector('td[data-label="Anticipo"]')?.textContent).toContain('Q 300.00');

    const list = fixture.componentInstance;
    list.sort('total');
    expect(get.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ sortBy: 'total', sortDirection: 'desc', page: 1 }));
    list.sort('total');
    expect(get.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ sortBy: 'total', sortDirection: 'asc' }));
    list.sort('customer');
    expect(get.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ sortBy: 'customer', sortDirection: 'asc' }));
    expect(list.ariaSort('customer')).toBe('ascending');
  });
});
