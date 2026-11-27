import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CashIntegrityReport, IntegrityFinding, OpeningStatus } from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { OpeningCountModalComponent } from '../opening-count-modal/opening-count-modal.component';
import { CashIntegrityPanelComponent } from './cash-integrity-panel.component';

const change = (over: Partial<IntegrityFinding> = {}): IntegrityFinding => ({
  key: 'DIFFERENCE_CHANGE:ARQUEO_CAJA:c-b',
  check: 'DIFFERENCE_CHANGE',
  severity: 'ALTA',
  classification: 'DIFERENCIA_ARQUEO',
  title: 'Faltan Q100.00 desde el conteo anterior',
  detail: 'Arqueo de Caja #2 contó Q6,925.00 contra Q7,075.00.',
  amount: -100,
  occurredAt: '2099-07-02T18:00:00Z',
  username: 'supervisor',
  movementIds: [],
  reference: null,
  window: { location: 'CAJA', afterSequence: 9, upToSequence: 14 },
  count: { source: 'ARQUEO_CAJA', id: 'c-b', label: 'Arqueo de Caja #2', difference: -150, resolution: null },
  relatedKeys: ['SOURCE_SIGN:BANK_DEPOSIT:op-1'],
  ...over,
});

const sign: IntegrityFinding = {
  ...change(),
  key: 'SOURCE_SIGN:BANK_DEPOSIT:op-1',
  check: 'SOURCE_SIGN',
  classification: 'ERROR_REGISTRO',
  title: 'Signo invertido',
  window: null,
  count: null,
  movementIds: ['m-inverted'],
  relatedKeys: [],
};

const OPENING: OpeningStatus = {
  dayOpeningId: 'd2',
  businessDate: '2099-07-02',
  previousCloseBalance: 6500,
  currentTheoretical: 6500,
  movementsSinceOpening: 0,
  lastCountBefore: { label: 'Corte 2 · 01/07/2099', countedAt: '2099-07-01T23:00:00Z', counted: 6500, difference: 0 },
  opening: null,
};

const report = (over: Partial<CashIntegrityReport> = {}): CashIntegrityReport => ({
  period: {
    kind: 'BANK_DAY', businessDate: '2099-07-02', dateFrom: '2099-07-02', dateTo: '2099-07-02',
    windowStart: '2099-07-02T14:00:00Z', windowEnd: null, isCurrent: true, afterSequence: 5, upToSequence: null,
  },
  summary: { status: 'ALERTA', bySeverity: { ALTA: 2, MEDIA: 0, BAJA: 0, INFO: 0 }, byClassification: {}, unresolvedDifferences: 1 },
  opening: OPENING,
  timeline: {
    caja: [
      { source: 'ARQUEO_CAJA', id: 'c-a', label: 'Arqueo de Caja #1', countedAt: '2099-07-02T15:00:00Z', sequence: 9, theoretical: 6950, counted: 6900, difference: -50, username: 'sup', isOpening: false, resolution: null },
      { source: 'ARQUEO_CAJA', id: 'c-b', label: 'Arqueo de Caja #2', countedAt: '2099-07-02T18:00:00Z', sequence: 14, theoretical: 7075, counted: 6925, difference: -150, username: 'sup', isOpening: false, resolution: null },
    ],
    bodega: [],
    previousCaja: { source: 'ARQUEO_CAJA', id: 'c-0', label: 'Apertura', countedAt: '2099-07-02T14:10:00Z', sequence: 5, theoretical: 6500, counted: 6450, difference: -50, username: 'sup', isOpening: true, resolution: null },
    previousBodega: null,
  },
  findings: [change(), sign],
  checkedAt: '2099-07-02T19:00:00Z',
  ...over,
});

describe('Auditoría de efectivo (Control de Efectivo)', () => {
  let service: CashControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CashIntegrityPanelComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ConfirmDialogService, useValue: { confirm: () => Promise.resolve(true) } },
      ],
    });
    service = TestBed.inject(CashControlService);
    spyOn(service, 'getIntegrity').and.returnValue(of(report()));
    spyOn(service, 'getStatementDays').and.returnValue(of([]));
    spyOn(service, 'getBalance').and.returnValue(of({ balance: 7075, lastSequence: 14, lastMovementAt: null }));
  });

  it('shows the status, the pending opening, when the difference changed and the possible causes', () => {
    const fixture = TestBed.createComponent(CashIntegrityPanelComponent);
    fixture.componentRef.setInput('canOperate', true);
    fixture.detectChanges();
    const panel = fixture.componentInstance;
    expect(panel.timeline().map((c) => [c.label, c.change])).toEqual([
      ['Arqueo de Caja #1', 0],
      ['Arqueo de Caja #2', -100],
    ]);
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Alerta');
    expect(text).toContain('Pendiente');
    expect(text).toContain('Contar apertura');
    expect(text).toContain('Posibles causas en ese tramo (verificar): Signo invertido');
    expect(text.toLowerCase()).not.toContain('fraude');
    // Only admins resolve, and only unresolved count differences.
    expect(panel.canResolveFinding(change())).toBeFalse();
    fixture.componentRef.setInput('canResolve', true);
    expect(panel.canResolveFinding(change())).toBeTrue();
    expect(panel.canResolveFinding(sign)).toBeFalse();
    expect(
      panel.canResolveFinding(change({ count: { ...change().count!, resolution: { id: 'r', cause: 'ERROR_REGISTRO', explanation: 'x', adjustmentMovementId: null, username: 'admin', createdAt: '' } } })),
    ).toBeFalse();
  });

  it('highlights, while investigating, the movements of the related findings', () => {
    const fixture = TestBed.createComponent(CashIntegrityPanelComponent);
    fixture.componentRef.setInput('refreshKey', 1);
    fixture.detectChanges();
    spyOn(service, 'getIntegrityMovements').and.returnValue(of({ items: [], total: 0, page: 1, limit: 500, filteredIn: 0, filteredOut: 0 }));
    fixture.componentInstance.investigating.set(change());
    expect(fixture.componentInstance.flagged()).toEqual(['m-inverted']);
  });

  it('the opening count asks for reason and responsible only when it differs from the system', async () => {
    const register = spyOn(service, 'registerOpeningCount').and.returnValue(of({ ...OPENING, opening: null }));
    const modal = TestBed.createComponent(OpeningCountModalComponent).componentInstance;
    modal.open = true;
    modal.status = OPENING;
    modal.ngOnChanges();
    modal.onQuantityChange({ denomination: 200, quantity: 32 });
    modal.onQuantityChange({ denomination: 50, quantity: 1 });
    expect([modal.difference(), modal.needsReason(), modal.canSave()]).toEqual([-50, true, false]);
    modal.reason.set('Faltan Q50 al abrir');
    modal.responsible.set('Supervisor');
    expect(modal.canSave()).toBeTrue();
    await modal.save();
    expect(register.calls.mostRecent().args[0]).toEqual(
      jasmine.objectContaining({ reason: 'Faltan Q50 al abrir', responsible: 'Supervisor', clientRequestId: jasmine.any(String) }),
    );
    modal.onQuantityChange({ denomination: 50, quantity: 2 });
    modal.reason.set('');
    expect([modal.difference(), modal.needsReason(), modal.canSave()]).toEqual([0, false, true]);
  });

  it('lists the reconciliation by operation: expected vs registered movement and its probable cause', () => {
    const linked: IntegrityFinding = {
      ...change(),
      key: 'LINKED_CHARGE_ACTIVE:ACCOUNT_RECEIVABLE:ar-1',
      check: 'LINKED_CHARGE_ACTIVE',
      classification: 'INCONSISTENCIA_HISTORICA',
      title: 'Operación anulada con su cargo vigente',
      amount: -300,
      window: null,
      count: null,
      relatedKeys: [],
      reference: { type: 'ACCOUNT_RECEIVABLE', id: 'ar-1', label: 'Cargo de Cuentas por Cobrar de Q300.00' },
      expected: 0,
      registered: -300,
    };
    (service.getIntegrity as jasmine.Spy).and.returnValue(of(report({ findings: [change(), linked] })));
    const fixture = TestBed.createComponent(CashIntegrityPanelComponent);
    fixture.componentRef.setInput('refreshKey', 1);
    fixture.detectChanges();
    const panel = fixture.componentInstance;
    expect(panel.reconciliation().map((f) => f.key)).toEqual(['LINKED_CHARGE_ACTIVE:ACCOUNT_RECEIVABLE:ar-1']);
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Conciliación por operación (1)');
    expect(text).toContain('Cuentas por Cobrar');
    expect(text).toContain('Cargo de Cuentas por Cobrar de Q300.00');
    expect(text).toContain('Operación anulada con su cargo vigente');
  });
});
