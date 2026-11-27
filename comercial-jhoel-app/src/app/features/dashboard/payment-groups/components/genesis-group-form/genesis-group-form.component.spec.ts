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
    amount: i === 10 ? 784 : 850,
    hasObservation: i === 2,
    observation: i === 2 ? ' Pagó con billetes de Q100 ' : '',
  }));

const cuota = (n: number, over: Partial<PaymentGroupItem> = {}): PaymentGroupItem =>
  ({
    id: `i-${n}`,
    itemNumber: n,
    expectedAmount: n === 11 ? 784 : 850,
    paidAmount: 0,
    reference: null,
    creditNumber: null,
    observation: n === 3 ? 'Pagó con billetes de Q100' : null,
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
    // No administrative header of the physical receipt, no credit number or client per cuota.
    expect(text()).not.toMatch(/Sucursal|Presidente|Secretario|Tesorero|Promotor|crédito|cliente/i);

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
    form.updateRow(10, { amount: 800 });
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
    expect(body.items[2]).toEqual({ expectedAmount: 850, observation: 'Pagó con billetes de Q100' });
    expect(body.items[0]).toEqual({ expectedAmount: 850, observation: undefined });
    expect(saved).toHaveBeenCalled();
  });

  it('the observation appears only when its checkbox is on; a cuota without amount blocks saving', () => {
    const fixture = TestBed.createComponent(GenesisGroupFormComponent);
    fixture.detectChanges();
    const form = fixture.componentInstance;
    const element = fixture.nativeElement as HTMLElement;
    form.name.set('EL GOLFO');
    form.total.set(1700);
    form.onDeclaredCount(2);
    fixture.detectChanges();
    expect(element.querySelector('[aria-label="Observación de la cuota 1"]')).toBeNull();
    const checkbox = element.querySelector('[aria-label="Agregar observación a la cuota 1"]') as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();
    expect(element.querySelector('[aria-label="Observación de la cuota 1"]')).not.toBeNull();
    form.updateRow(0, { observation: 'Pagó tarde' });
    form.toggleObservation(0, false);
    fixture.detectChanges();
    expect(element.querySelector('[aria-label="Observación de la cuota 1"]')).toBeNull();
    expect(form.rows()[0].observation).toBe('');

    form.rows.set(golfoRows().slice(0, 3));
    form.removeRow(2);
    form.updateRow(1, { amount: 0 });
    expect(form.incomplete()).toEqual([2]);
    expect(form.problems().some((p) => p.includes('Indique el monto de la(s) cuota(s) #2'))).toBeTrue();
  });

  it('corrects a pending group with its rows and the reason', async () => {
    const update = spyOn(service, 'updatePending').and.returnValue(of(golfo()));
    const fixture = TestBed.createComponent(GenesisGroupFormComponent);
    fixture.componentRef.setInput('group', golfo());
    fixture.detectChanges();
    const form = fixture.componentInstance;
    expect(form.rows().length).toBe(11);
    expect(form.declaredCount()).toBe(11);
    // The stored observation of cuota 3 comes back with its checkbox on.
    expect(form.rows()[2]).toEqual({ amount: 850, hasObservation: true, observation: 'Pagó con billetes de Q100' });
    expect(form.rows()[0].hasObservation).toBeFalse();
    form.note.set('Monto mal escrito');
    form.updateRow(0, { amount: 800 });
    form.updateRow(1, { amount: 900 });
    await form.save();
    expect(update).toHaveBeenCalledWith(
      'g-25',
      jasmine.objectContaining({ declaredCount: 11, authorizedAmount: 9284, note: 'Monto mal escrito' }),
    );
    expect(update.calls.mostRecent().args[1].items.slice(0, 2)).toEqual([
      { expectedAmount: 800, observation: undefined },
      { expectedAmount: 900, observation: undefined },
    ]);
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
