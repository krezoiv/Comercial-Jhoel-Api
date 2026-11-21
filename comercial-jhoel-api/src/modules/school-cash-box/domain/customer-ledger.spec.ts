import {
  LedgerHistoryInput,
  LedgerListInput,
  LedgerPaymentInput,
  buildCustomerLedger,
  customerAccountStatus,
  paymentTypeLabel,
} from './customer-ledger';

const at = (day: string, time = '15:00:00') => `${day}T${time}.000Z`;
let seq = 0;
const created = (
  quotationId: string,
  total: number,
  day: string,
  draft = false,
): LedgerHistoryInput => ({
  seq: ++seq,
  quotationId,
  action: 'CREADA',
  fromStatus: null,
  toStatus: draft ? 'BORRADOR' : 'ACEPTADA',
  details: { total },
  createdAt: at(day),
});
const payment = (
  quotationId: string,
  kind: string,
  amount: number,
  day: string,
  extra: Partial<LedgerPaymentInput> = {},
): LedgerPaymentInput => ({
  seq: ++seq,
  id: `p${seq}`,
  quotationId,
  receiptNumber: `RLE-${String(seq).padStart(6, '0')}`,
  kind,
  amount,
  paymentMethodLabel: 'Efectivo',
  bankName: null,
  reference: null,
  balanceAfter: 1,
  reversedReceipt: null,
  receivedAt: at(day, '16:00:00'),
  ...extra,
});

const juan: LedgerListInput = {
  id: 'q1',
  quotationNumber: 'LE-000001',
  studentName: 'Juan',
  grade: 'Primero',
  status: 'ACEPTADA',
  total: 800,
  paid: 500,
};
const ana: LedgerListInput = {
  id: 'q2',
  quotationNumber: 'LE-000002',
  studentName: 'Ana',
  grade: 'Tercero',
  status: 'ACEPTADA',
  total: 650,
  paid: 0,
};

describe('Estado de cuenta de clientes — reglas', () => {
  it('classifies the customer from the official totals', () => {
    expect(
      customerAccountStatus({ activeLists: 2, paid: 0, balance: 1450 }),
    ).toBe('PENDIENTE');
    expect(
      customerAccountStatus({ activeLists: 2, paid: 500, balance: 950 }),
    ).toBe('ABONANDO');
    expect(
      customerAccountStatus({ activeLists: 1, paid: 800, balance: 0 }),
    ).toBe('SOLVENTE');
    expect(customerAccountStatus({ activeLists: 0, paid: 0, balance: 0 })).toBe(
      'CANCELADO',
    );
  });

  it('names the payment that leaves a list at zero "Liquidación"', () => {
    expect(paymentTypeLabel('ANTICIPO', 100)).toBe('Pago inicial');
    expect(paymentTypeLabel('ANTICIPO', 0)).toBe('Pago total');
    expect(paymentTypeLabel('ABONO', 20)).toBe('Abono');
    expect(paymentTypeLabel('ABONO', 0)).toBe('Liquidación');
  });

  it('two lists (two children): charges, partial payments and a running balance that ends at the official one', () => {
    const ledger = buildCustomerLedger(
      [juan, ana],
      [created('q1', 800, '2026-01-10'), created('q2', 650, '2026-01-11')],
      [
        payment('q1', 'ANTICIPO', 300, '2026-01-10'),
        payment('q1', 'ABONO', 200, '2026-01-12', {
          paymentMethodLabel: 'Transferencia',
          bankName: 'BI',
        }),
      ],
    );
    expect(
      ledger.rows.map((r) => [r.kind, r.charge, r.credit, r.balance]),
    ).toEqual([
      ['CARGO_LISTA', 800, 0, 800],
      ['PAGO', 0, 300, 500],
      ['CARGO_LISTA', 650, 0, 1150],
      ['PAGO', 0, 200, 950],
    ]);
    expect(ledger.rows[0].description).toContain('Juan');
    expect(ledger.rows[3].description).toContain('Transferencia · BI');
    expect(ledger.closing).toBe(950);
    expect(ledger.officialBalance).toBe(950);
    expect(ledger.consistent).toBe(true);
  });

  it('a charge comes before the advance paid in the same instant', () => {
    const list = { ...juan, paid: 300 };
    const ledger = buildCustomerLedger(
      [list],
      [
        {
          ...created('q1', 800, '2026-01-10'),
          createdAt: at('2026-01-10', '16:00:00'),
        },
      ],
      [payment('q1', 'ANTICIPO', 300, '2026-01-10')],
    );
    expect(ledger.rows.map((r) => r.kind)).toEqual(['CARGO_LISTA', 'PAGO']);
    expect(ledger.rows.every((r) => r.balance >= 0)).toBe(true);
  });

  it('edits change the debt by their difference; a draft only owes from its confirmation', () => {
    const list = { ...juan, total: 900, paid: 0 };
    const ledger = buildCustomerLedger(
      [list],
      [
        created('q1', 700, '2026-01-09', true),
        {
          seq: ++seq,
          quotationId: 'q1',
          action: 'EDITADA',
          fromStatus: 'BORRADOR',
          toStatus: 'BORRADOR',
          details: { totalBefore: 700, totalAfter: 800 },
          createdAt: at('2026-01-09', '17:00:00'),
        },
        {
          seq: ++seq,
          quotationId: 'q1',
          action: 'CONFIRMAR',
          fromStatus: 'BORRADOR',
          toStatus: 'ACEPTADA',
          details: {},
          createdAt: at('2026-01-10'),
        },
        {
          seq: ++seq,
          quotationId: 'q1',
          action: 'EDITADA',
          fromStatus: 'ACEPTADA',
          toStatus: 'ACEPTADA',
          details: { totalBefore: 800, totalAfter: 900 },
          createdAt: at('2026-01-11'),
        },
      ],
      [],
    );
    expect(ledger.rows.map((r) => [r.kind, r.charge])).toEqual([
      ['CARGO_LISTA', 800],
      ['MODIFICACION', 100],
    ]);
    expect(ledger.consistent).toBe(true);
  });

  it('void and cancellation with refund: real reversal rows, final balance zero', () => {
    const list = { ...juan, status: 'CANCELADA', paid: 0 };
    const ledger = buildCustomerLedger(
      [list],
      [
        created('q1', 800, '2026-01-10'),
        {
          seq: ++seq,
          quotationId: 'q1',
          action: 'CANCELADA',
          fromStatus: 'ACEPTADA',
          toStatus: 'CANCELADA',
          details: { refunded: 300 },
          createdAt: at('2026-01-15', '18:00:00'),
        },
      ],
      [
        payment('q1', 'ANTICIPO', 300, '2026-01-10'),
        payment('q1', 'ABONO', 100, '2026-01-12'),
        payment('q1', 'ANULACION', 100, '2026-01-13', {
          reversedReceipt: 'RLE-X',
        }),
        {
          ...payment('q1', 'DEVOLUCION', 300, '2026-01-15'),
          receivedAt: at('2026-01-15', '18:00:00'),
        },
      ],
    );
    expect(ledger.rows.map((r) => r.kind)).toEqual([
      'CARGO_LISTA',
      'PAGO',
      'PAGO',
      'ANULACION_PAGO',
      'DEVOLUCION',
      'CANCELACION',
    ]);
    expect(ledger.rows[3].charge).toBe(100);
    expect(ledger.closing).toBe(0);
    expect(ledger.officialBalance).toBe(0);
    expect(ledger.consistent).toBe(true);
  });

  it('with a period: earlier movements become the opening balance', () => {
    const ledger = buildCustomerLedger(
      [juan],
      [created('q1', 800, '2026-01-10')],
      [
        payment('q1', 'ANTICIPO', 300, '2026-01-10'),
        payment('q1', 'ABONO', 200, '2026-02-02'),
      ],
      { from: '2026-02-01', to: '2026-02-28' },
    );
    expect(ledger.opening).toBe(500);
    expect(ledger.rows.map((r) => [r.kind, r.balance])).toEqual([
      ['SALDO_INICIAL', 500],
      ['PAGO', 300],
    ]);
  });

  it('reports a mismatch instead of inventing a movement', () => {
    const ledger = buildCustomerLedger([{ ...juan, paid: 0 }], [], []);
    expect(ledger.rows).toEqual([]);
    expect(ledger.officialBalance).toBe(800);
    expect(ledger.consistent).toBe(false);
  });
});

describe('Estado de cuenta — una cotización no es dinero (migración 1760009000000)', () => {
  const event = (
    quotationId: string,
    action: string,
    fromStatus: string | null,
    toStatus: string,
    day: string,
    details: Record<string, unknown> = {},
  ): LedgerHistoryInput => ({
    seq: ++seq,
    quotationId,
    action,
    fromStatus,
    toStatus,
    details,
    createdAt: at(day, '15:30:00'),
  });
  const quote = (
    id: string,
    status: string,
    total: number,
    paid: number,
  ): LedgerListInput => ({
    id,
    quotationNumber: `LE-${id}`,
    studentName: 'Luis',
    grade: 'Primero',
    status,
    total,
    paid,
  });
  const quoted = (
    id: string,
    total: number,
    day: string,
  ): LedgerHistoryInput => ({
    ...created(id, total, day),
    toStatus: 'COTIZADA',
  });

  it('a quotation (COTIZADA) is never charged nor owed', () => {
    const ledger = buildCustomerLedger(
      [quote('c1', 'COTIZADA', 1000, 0)],
      [quoted('c1', 1000, '2026-11-20')],
      [],
    );
    expect(ledger.rows).toHaveLength(0);
    expect(ledger.closing).toBe(0);
    expect(ledger.officialBalance).toBe(0);
    expect(ledger.consistent).toBe(true);
  });

  it('it is charged when the customer accepts it, then each payment lowers the balance', () => {
    const ledger = buildCustomerLedger(
      [quote('c2', 'ACEPTADA', 1000, 500)],
      [
        quoted('c2', 1000, '2026-11-20'),
        event('c2', 'ACEPTAR', 'COTIZADA', 'ACEPTADA', '2026-11-21', {
          total: 1000,
        }),
      ],
      [
        payment('c2', 'ANTICIPO', 300, '2026-11-21'),
        payment('c2', 'ABONO', 200, '2026-11-22'),
      ],
    );
    expect(ledger.rows.map((r) => `${r.kind}:${r.balance}`)).toEqual([
      'CARGO_LISTA:1000',
      'PAGO:700',
      'PAGO:500',
    ]);
    expect(ledger.rows[0].description).toContain('(aceptada)');
    expect(ledger.closing).toBe(500);
    expect(ledger.consistent).toBe(true);
  });

  it('"devuelta a cotización" removes the charge (audited correction)', () => {
    const ledger = buildCustomerLedger(
      [quote('c3', 'COTIZADA', 450, 0)],
      [
        { ...created('c3', 450, '2026-11-18') },
        event(
          'c3',
          'DEVUELTA_COTIZACION',
          'ACEPTADA',
          'COTIZADA',
          '2026-11-21',
          {
            reason: 'Solo pidió la cotización',
            total: 450,
          },
        ),
      ],
      [],
    );
    expect(ledger.rows.map((r) => `${r.kind}:${r.balance}`)).toEqual([
      'CARGO_LISTA:450',
      'CANCELACION:0',
    ]);
    expect(ledger.rows[1].description).toContain('devuelta a cotización');
    expect(ledger.consistent).toBe(true);
  });

  it('an old list accepted by its first payment is charged right before that payment', () => {
    const ledger = buildCustomerLedger(
      [quote('c4', 'ANTICIPO_RECIBIDO', 600, 100)],
      [
        quoted('c4', 600, '2026-11-15'),
        {
          ...event('c4', 'PAGO', 'COTIZADA', 'ANTICIPO_RECIBIDO', '2026-11-16'),
          createdAt: at('2026-11-16', '16:00:00'),
        },
      ],
      [payment('c4', 'ANTICIPO', 100, '2026-11-16')],
    );
    expect(ledger.rows.map((r) => `${r.kind}:${r.balance}`)).toEqual([
      'CARGO_LISTA:600',
      'PAGO:500',
    ]);
    expect(ledger.closing).toBe(500);
    expect(ledger.consistent).toBe(true);
  });

  it('a customer with only quotations is COTIZANDO, not owing', () => {
    expect(
      customerAccountStatus({ activeLists: 0, paid: 0, balance: 0, quotes: 2 }),
    ).toBe('COTIZANDO');
  });
});
