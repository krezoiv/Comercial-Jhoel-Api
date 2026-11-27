import {
  classifySource,
  differenceChanges,
  linkedChargeFinding,
  relateFindings,
  summarize,
  type SourceComparison,
  type TimelineCount,
} from './cash-integrity';

const source = (over: Partial<SourceComparison> = {}): SourceComparison => ({
  referenceType: 'BANK_DEPOSIT',
  referenceId: 'op-1',
  label: 'Retiros de Q150.00 — Juan',
  occurredAt: new Date('2099-07-02T15:00:00Z'),
  username: 'cajero',
  expectedNet: -150,
  kardexNet: -150,
  rows: 1,
  activeRows: 1,
  expectsRow: true,
  movementIds: ['m1'],
  rule: 'Retiros sale de Caja',
  ...over,
});

const count = (over: Partial<TimelineCount> = {}): TimelineCount => ({
  source: 'ARQUEO_CAJA',
  id: 'c1',
  label: 'Arqueo de Caja #1',
  countedAt: new Date('2099-07-02T15:00:00Z'),
  sequence: 10,
  theoretical: 1000,
  counted: 1000,
  difference: 0,
  username: 'supervisor',
  isOpening: false,
  resolution: null,
  ...over,
});

describe('Auditoría de efectivo — reglas', () => {
  it('an operation that agrees with its Kardex effect is not a finding', () => {
    expect(classifySource(source())).toBeNull();
    // Voided: original + annulment net to zero.
    expect(
      classifySource(
        source({ expectedNet: 0, kardexNet: 0, rows: 2, activeRows: 0 }),
      ),
    ).toBeNull();
    // Older than the Kardex: never tracked, never "omitted".
    expect(classifySource(source({ rows: 0, expectsRow: false }))).toBeNull();
  });

  it('classifies every mismatch with facts, never as fraud', () => {
    expect(
      classifySource(
        source({ rows: 0, activeRows: 0, kardexNet: 0, movementIds: [] }),
      ),
    ).toMatchObject({
      check: 'SOURCE_MISSING',
      classification: 'MOVIMIENTO_OMITIDO',
      severity: 'ALTA',
    });
    expect(
      classifySource(source({ kardexNet: -300, activeRows: 2, rows: 2 })),
    ).toMatchObject({
      check: 'DUPLICATE_REFERENCE',
      classification: 'MOVIMIENTO_DUPLICADO',
    });
    expect(classifySource(source({ kardexNet: 150 }))).toMatchObject({
      check: 'SOURCE_SIGN',
      classification: 'ERROR_REGISTRO',
      amount: 300,
    });
    expect(
      classifySource(source({ expectedNet: 0, kardexNet: 150 })),
    ).toMatchObject({
      check: 'SOURCE_UNEXPECTED',
    });
    expect(
      classifySource(source({ kardexNet: 0, activeRows: 0 })),
    ).toMatchObject({
      check: 'SOURCE_NO_EFFECT',
      classification: 'MOVIMIENTO_OMITIDO',
    });
    const amount = classifySource(source({ kardexNet: -105 }));
    expect(amount).toMatchObject({ check: 'SOURCE_AMOUNT', amount: 45 });
    expect(amount!.detail).toContain('Q45.00');
    expect(amount!.detail.toLowerCase()).not.toContain('fraude');
  });

  it('locates when a difference started: only changes between consecutive counts are findings', () => {
    const findings = differenceChanges(
      'CAJA',
      count({ id: 'prev', sequence: 5, difference: 0 }),
      [
        count({
          id: 'open',
          label: 'Arqueo de apertura #2',
          sequence: 5,
          difference: -50,
          isOpening: true,
        }),
        count({ id: 'a', sequence: 9, difference: -50 }),
        count({ id: 'b', sequence: 14, difference: -150 }),
      ],
    );
    expect(findings.map((f) => [f.count!.id, f.amount, f.window])).toEqual([
      ['open', -50, { location: 'CAJA', afterSequence: 5, upToSequence: 5 }],
      ['b', -100, { location: 'CAJA', afterSequence: 9, upToSequence: 14 }],
    ]);
    expect(findings[1].title).toBe('Faltan Q100.00 desde el conteo anterior');
    expect(findings[1].severity).toBe('ALTA');
  });

  it('relates other findings inside a difference window as possible explanations', () => {
    const [change] = differenceChanges('CAJA', count({ sequence: 9 }), [
      count({ id: 'b', sequence: 14, difference: -100 }),
    ]);
    const sign = {
      ...classifySource(source({ kardexNet: 150, movementIds: ['inside'] }))!,
      window: null,
      count: null,
    };
    const outside = {
      ...classifySource(
        source({
          referenceId: 'op-2',
          kardexNet: 0,
          activeRows: 0,
          movementIds: ['outside'],
        }),
      )!,
      window: null,
      count: null,
    };
    const sequences = new Map([
      ['inside', 12],
      ['outside', 20],
    ]);
    const related = relateFindings([change, sign, outside], (id) =>
      sequences.get(id),
    );
    expect(related[0].relatedKeys).toEqual([sign.key]);
    expect(related[1].relatedKeys).toEqual([]);
  });

  it('summarizes: any high finding is an alert; unresolved differences are counted', () => {
    const [change] = differenceChanges('CAJA', null, [
      count({ difference: -10 }),
    ]);
    const summary = summarize(relateFindings([change], () => undefined));
    expect(summary).toMatchObject({
      status: 'REVISAR',
      unresolvedDifferences: 1,
    });
    expect(summarize([]).status).toBe('OK');
    const resolved = {
      ...change,
      count: {
        ...change.count!,
        resolution: {
          id: 'r',
          cause: 'DIFERENCIA_ARQUEO' as const,
          explanation: 'x',
          adjustmentMovementId: null,
          username: 'admin',
          createdAt: new Date(),
        },
      },
    };
    expect(
      summarize(relateFindings([resolved], () => undefined))
        .unresolvedDifferences,
    ).toBe(0);
  });

  it('reports expected vs registered per operation (reconciliation report)', () => {
    const finding = classifySource(
      source({
        referenceType: 'ACCOUNT_RECEIVABLE',
        label: 'Abono por cobrar de Q200.00 — Cliente A',
        expectedNet: 0,
        kardexNet: 200,
        rule: 'Registro anulado: su efecto neto debe ser Q0.00',
      }),
    );
    expect(finding).toMatchObject({
      check: 'SOURCE_UNEXPECTED',
      expected: 0,
      registered: 200,
      amount: 200,
    });
  });

  it('flags a cargo left active by a Transaccionar operation voided before the cascade', () => {
    const finding = linkedChargeFinding({
      recordType: 'ACCOUNT_RECEIVABLE',
      recordId: 'ar-1',
      operationId: 'op-1',
      operationLabel: 'Depósito de Q300.00 de Transaccionar',
      clientName: 'Cliente B',
      amount: 300,
      kardexNet: -300,
      voidedAt: new Date('2026-11-20T15:00:00Z'),
      voidedBy: 'admin',
      movementIds: ['m-1'],
    });
    expect(finding).toMatchObject({
      key: 'LINKED_CHARGE_ACTIVE:ACCOUNT_RECEIVABLE:ar-1',
      severity: 'ALTA',
      classification: 'INCONSISTENCIA_HISTORICA',
      expected: 0,
      registered: -300,
    });
    expect(finding.detail).toContain('anule el cargo en Cuentas por Cobrar');
    expect(finding.detail.toLowerCase()).not.toContain('fraude');
  });
});
