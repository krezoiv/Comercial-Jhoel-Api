import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { PaymentGroup, PaymentGroupDetail, PaymentGroupItem } from '../../../../../core/models';
import { AuthService } from '../../../../../core/services/auth.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { PaymentGroupService } from '../../../../../core/services/payment-group.service';
import { PaymentGroupDetailPageComponent } from '../../payment-group-detail-page.component';
import { GenesisGroupFormComponent } from './genesis-group-form.component';

/** EL GOLFO: 10 cuotas of Q850.00 and one of Q784.00 = Q9,284.00. */
const golfoRows = () =>
  Array.from({ length: 11 }, (_, i) => ({
    creditNumber: ` CR-${1001 + i} `,
    client: `Cliente ${i + 1}`,
    amount: i === 10 ? 784 : 850,
    observation: i === 2 ? ' Pagó con billetes de Q100 ' : '',
  }));

const cuota = (n: number, over: Partial<PaymentGroupItem> = {}): PaymentGroupItem =>
  ({
    id: `i-${n}`,
    itemNumber: n,
    expectedAmount: n === 11 ? 784 : 850,
    paidAmount: 0,
    reference: `Cliente ${n}`,
    creditNumber: `CR-${1000 + n}`,
    observation: null,
    status: 'PENDIENTE',
    operations: [],
    ...over,
  }) as PaymentGroupItem;

const golfo = (over: Partial<PaymentGroup> = {}, pending = true): PaymentGroupDetail => ({
  group: {
    id: 'g-25',
    code: 'PG-000025',
    transactionTypeId: 't-genesis',
    transactionTypeName: 'Pago Préstamos Génesis',
    cashDirection: 'IN',
    description: 'EL GOLFO',
    operationDate: '2026-11-27',
    authorizedAmount: 9284,
    assignedAmount: 9284,
    lifecycle: pending ? 'ABIERTO' : 'CERRADO',
    status: pending ? 'PENDIENTE_APROBACION' : 'APROBADO',
    requiresApproval: true,
    approvedAt: pending ? null : '2026-11-27T16:00:00Z',
    approvedByUsername: pending ? null : 'admin',
    paidAmount: pending ? 0 : 9284,
    createdBy: 'u-creator',
    createdByUsername: 'cajero',
    ...over,
  } as PaymentGroup,
  items: Array.from({ length: 11 }, (_, i) => cuota(i + 1, pending ? {} : { status: 'PAGADO', paidAmount: i === 10 ? 784 : 850 })),
  cash: { balance: 1000, reserved: 0, available: 1000 },
  closeCheck: { canClose: false, pendingCount: 11, unresolvedCount: 0, releaseOnClose: 0 },
  approvalCheck: {
    required: true,
    pending,
    canApprove: pending,
    cuotaCount: 11,
    cuotasTotal: 9284,
    declaredTotal: 9284,
    difference: 0,
    incompleteCuotas: [],
  },
});

describe('Pago grupal Génesis: registro simplificado y aprobación', () => {
  let service: PaymentGroupService;
  let isAdmin = false;
  let userId = 'u-creator';

  beforeEach(() => {
    isAdmin = false;
    userId = 'u-creator';
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true) } },
        { provide: AuthService, useValue: { isAdmin: () => isAdmin, currentUser: () => ({ id: userId }) } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'g-25' }), queryParamMap: convertToParamMap({}) } },
        },
      ],
    });
    service = TestBed.inject(PaymentGroupService);
  });

  it('asks only name, total and count; checks count, sum and difference before saving', async () => {
    const create = spyOn(service, 'create').and.returnValue(of(golfo()));
    const fixture = TestBed.createComponent(GenesisGroupFormComponent);
    fixture.componentRef.setInput('transactionTypeId', 't-genesis');
    fixture.detectChanges();
    const form = fixture.componentInstance;
    const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';
    // No administrative header of the physical receipt.
    expect(text()).not.toMatch(/Sucursal|Presidente|Secretario|Tesorero|Promotor/);

    form.name.set('EL GOLFO');
    form.total.set(9284);
    form.onDeclaredCount(11);
    expect(form.rows().length).toBe(11); // empty table → 11 rows ready to type
    form.rows.set(golfoRows().slice(0, 10));
    fixture.detectChanges();
    expect(form.problems()).toContain('Se declararon 11 cuota(s) y hay 10 registrada(s).');
    expect(form.difference()).toBe(784);
    await form.save();
    expect(create).not.toHaveBeenCalled();

    form.addRow();
    form.updateRow(10, { creditNumber: 'CR-1011', client: 'Cliente 11', amount: 800 });
    expect(form.problems().some((p) => p.includes('no coincide con el monto total'))).toBeTrue();
    form.updateRow(10, { amount: 784 });
    fixture.detectChanges();
    expect(form.problems()).toEqual([]);
    expect(text()).toContain('Información correcta');

    const saved = jasmine.createSpy('saved');
    form.saved.subscribe(saved);
    await form.save();
    const body = create.calls.mostRecent().args[0];
    expect(body).toEqual(jasmine.objectContaining({ description: 'EL GOLFO', authorizedAmount: 9284, declaredCount: 11 }));
    expect(body.items.length).toBe(11);
    expect(body.items[2]).toEqual({
      creditNumber: 'CR-1003',
      reference: 'Cliente 3',
      expectedAmount: 850,
      observation: 'Pagó con billetes de Q100',
    });
    expect(saved).toHaveBeenCalled();
  });

  it('rows can be removed; an incomplete row blocks saving', () => {
    const fixture = TestBed.createComponent(GenesisGroupFormComponent);
    fixture.detectChanges();
    const form = fixture.componentInstance;
    form.name.set('EL GOLFO');
    form.total.set(1700);
    form.onDeclaredCount(2);
    form.rows.set(golfoRows().slice(0, 3));
    form.removeRow(2);
    form.updateRow(1, { client: '' });
    expect(form.incomplete()).toEqual([2]);
    expect(form.problems().some((p) => p.includes('#2'))).toBeTrue();
  });

  it('corrects a pending group with its rows and the reason', async () => {
    const update = spyOn(service, 'updatePending').and.returnValue(of(golfo()));
    const fixture = TestBed.createComponent(GenesisGroupFormComponent);
    fixture.componentRef.setInput('group', golfo());
    fixture.detectChanges();
    const form = fixture.componentInstance;
    expect(form.rows().length).toBe(11);
    expect(form.declaredCount()).toBe(11);
    form.note.set('Cliente mal escrito');
    form.updateRow(0, { client: 'Cliente Uno' });
    await form.save();
    expect(update).toHaveBeenCalledWith(
      'g-25',
      jasmine.objectContaining({ declaredCount: 11, authorizedAmount: 9284, note: 'Cliente mal escrito' }),
    );
    expect(update.calls.mostRecent().args[1].items[0].reference).toBe('Cliente Uno');
  });

  it('detail: an admin approves what was reviewed; no per-cuota actions while pending', async () => {
    isAdmin = true;
    userId = 'u-admin';
    spyOn(service, 'get').and.returnValue(of(golfo()));
    const approve = spyOn(service, 'approve').and.returnValue(of(golfo({}, false)));
    const fixture = TestBed.createComponent(PaymentGroupDetailPageComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Pendiente de aprobación');
    expect(element.textContent).toContain('Información correcta');
    expect(element.querySelector('[aria-label^="Registrar cobro"]')).toBeNull();
    expect(element.textContent).not.toContain('Cerrar grupo');

    await fixture.componentInstance.approve();
    const [id, body] = approve.calls.mostRecent().args;
    expect(id).toBe('g-25');
    expect(body).toEqual(jasmine.objectContaining({ expectedAmount: 9284, expectedCount: 11 }));
    fixture.detectChanges();
    expect(element.textContent).toContain('Aprobado');
    expect(element.textContent).toContain('11 cuota(s) contabilizadas');
  });

  it('detail: the creator corrects but does not approve; another cashier does neither', () => {
    spyOn(service, 'get').and.returnValue(of(golfo()));
    let fixture = TestBed.createComponent(PaymentGroupDetailPageComponent);
    fixture.detectChanges();
    let text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(fixture.componentInstance.canCorrect()).toBeTrue();
    expect(text).toContain('Corregir');
    expect(text).not.toContain('Aprobar');

    userId = 'u-other';
    fixture = TestBed.createComponent(PaymentGroupDetailPageComponent);
    fixture.detectChanges();
    text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(fixture.componentInstance.canCorrect()).toBeFalse();
    expect(text).not.toContain('Corregir');
  });
});
