import type {
  QuotationDetailRow,
  SchoolListRepository,
} from '../../domain/repositories/school-list.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import {
  assertPositiveMoney,
  CreateSchoolQuotationUseCase,
  GetSchoolListDashboardUseCase,
  GetSchoolListPermissionsUseCase,
  GetSchoolQuotationPdfUseCase,
  GetSchoolReceiptPdfUseCase,
  guatemalaToday,
  ListSchoolTemplatesUseCase,
  RegisterSchoolPaymentUseCase,
  SaveSchoolTemplateUseCase,
  UpdateSchoolQuotationUseCase,
  VoidSchoolPaymentUseCase,
  CancelSchoolQuotationUseCase,
  ChangeSchoolQuotationStatusUseCase,
  GetSchoolBodegaStockUseCase,
  SaveSchoolPreparationUseCase,
  PreviewSchoolQuotationPurgeUseCase,
  PurgeSchoolQuotationsUseCase,
  PreviewSchoolQuotationDeleteUseCase,
  DeleteSchoolQuotationUseCase,
} from './school-list.use-cases';
import {
  AllocateSupplyManualUseCase,
  AllocateSupplyPurchaseUseCase,
  DispatchSchoolQuotationUseCase,
  RunSupplyFifoUseCase,
  SetSupplySettingsUseCase,
} from './school-supply.use-cases';
import { SchoolListRuleError } from '../../domain/errors/school-list.errors';

const admin = { userId: 'u-admin', role: 'ADMIN' };
const cashier = { userId: 'u-user', role: 'USER' };
const supervisor = { userId: 'u-sup', role: 'SUPERVISOR_DE_TURNO' };
const REQUEST_ID = '0b9e2d4a-7c1f-4d8e-9a6b-3f2e1d0c9b8a';

const detail: QuotationDetailRow = {
  id: 'q1',
  quotationNumber: 'LE-000001',
  quotationDate: '2099-01-10',
  deliveryDate: null,
  customerName: 'María López',
  customerPhone: '5555-1234',
  studentName: 'Ana',
  grade: 'Primero Básico',
  templateId: 't1',
  templateName: 'Primero Básico',
  total: 850,
  advance: 300,
  paid: 300,
  balance: 550,
  status: 'ANTICIPO_RECIBIDO',
  fulfillmentMode: 'CONFIRMACION',
  accountStatus: 'PARCIAL',
  supplyStatus: 'NO_APLICA',
  version: 2,
  createdAt: '2099-01-10T15:00:00.000Z',
  createdByUsername: 'cajero',
  subtotal: 850,
  discount: 0,
  observations: 'Recoge el viernes',
  updatedAt: '2099-01-10T15:00:00.000Z',
  finishedAt: null,
  finishedByUsername: null,
  deliveredAt: null,
  deliveredByUsername: null,
  cancelledAt: null,
  cancelledByUsername: null,
  cancelReason: null,
  items: [
    {
      id: 'i1',
      lineNo: 1,
      source: 'MANUAL',
      templateItemId: null,
      productId: null,
      productName: 'Cuaderno grande',
      productSku: null,
      categoryId: null,
      categoryName: null,
      description: null,
      quantity: 1,
      unitPrice: 25,
      discount: 0,
      subtotal: 25,
      observations: null,
      assignments: [],
    },
  ],
  payments: [
    {
      id: 'p1',
      quotationId: 'q1',
      receiptNumber: 'RLE-000001',
      kind: 'ANTICIPO',
      amount: 300,
      effect: 300,
      runningBalance: 550,
      paymentMethod: 'EFECTIVO',
      bankId: null,
      bankName: null,
      reference: null,
      observations: null,
      status: 'APLICADO',
      reversalOfId: null,
      receivedAt: '2099-01-10T15:00:00.000Z',
      receivedByUsername: 'cajero',
      voidedAt: null,
      voidedByUsername: null,
      voidReason: null,
    },
  ],
  history: [],
  inventory: [],
  supply: {
    status: 'NO_APLICA',
    confirmedAt: null,
    lines: [],
    uncontrolledLines: 0,
    allocations: [],
    dispatch: null,
  },
  account: {
    total: 850,
    advances: 300,
    installments: 0,
    refunds: 0,
    paid: 300,
    balance: 550,
  },
};

const purgeSummary = {
  quotations: 3,
  payments: 2,
  movements: 4,
  allocations: 0,
  dispatches: 0,
  returnedUnits: 7,
  returned: [{ productId: 'p1', product: 'Cuaderno', units: 7 }],
};

function repository(): jest.Mocked<SchoolListRepository> {
  return {
    listTemplates: jest.fn().mockResolvedValue([]),
    getTemplate: jest.fn().mockResolvedValue({ id: 't1', items: [] }),
    saveTemplate: jest.fn().mockResolvedValue('t1'),
    setTemplateActive: jest.fn().mockResolvedValue('t1'),
    duplicateTemplate: jest.fn().mockResolvedValue('t2'),
    findQuotations: jest.fn(),
    getQuotation: jest.fn().mockResolvedValue(detail),
    createQuotation: jest.fn().mockResolvedValue('q1'),
    updateQuotation: jest.fn().mockResolvedValue('q1'),
    setObservations: jest.fn().mockResolvedValue('q1'),
    changeStatus: jest.fn().mockResolvedValue('q1'),
    savePreparation: jest.fn().mockResolvedValue('q1'),
    purgePreview: jest.fn().mockResolvedValue(purgeSummary),
    purgeQuotations: jest.fn().mockResolvedValue(purgeSummary),
    deleteQuotation: jest
      .fn()
      .mockResolvedValue({ ...purgeSummary, quotations: 1 }),
    cancelQuotation: jest.fn().mockResolvedValue('q1'),
    registerPayment: jest.fn().mockResolvedValue('p2'),
    voidPayment: jest.fn().mockResolvedValue('p3'),
    findPayment: jest.fn().mockResolvedValue(detail.payments[0]),
    dashboard: jest.fn().mockResolvedValue({ totalQuotations: 0 }),
    supplyProducts: jest.fn(),
    supplyProductLists: jest.fn().mockResolvedValue([]),
    supplyPurchases: jest.fn(),
    supplyMode: jest.fn().mockResolvedValue('FIFO_AUTO'),
    setSupplyMode: jest
      .fn()
      .mockImplementation((mode: string) => Promise.resolve(mode)),
    runFifo: jest.fn().mockResolvedValue(3),
    allocatePurchase: jest.fn().mockResolvedValue(5),
    allocateManual: jest.fn().mockResolvedValue('a1'),
    dispatch: jest.fn().mockResolvedValue('d1'),
    bodegaStock: jest
      .fn()
      .mockResolvedValue([{ productId: 'p1', quantity: 7 }]),
  };
}

const company = {
  get: jest.fn().mockResolvedValue({
    businessName: 'Comercial Jhoel',
    address: 'Zona 1',
    phone: '7777-0000',
    email: null,
    taxId: null,
    logoBase64: null,
    whatsapp: '5555-0000',
    website: null,
    businessHours: 'Lunes a sábado',
  }),
} as unknown as CompanySettingsRepository;

const quotationInput = {
  templateId: 't1',
  customerName: 'María López',
  customerPhone: '5555-1234',
  items: [{ productName: 'Lápiz', quantity: 5, unitPrice: 2 }],
};

describe('Listas Escolares — use cases', () => {
  it('exposes the permissions of each role', () => {
    const useCase = new GetSchoolListPermissionsUseCase();
    expect(useCase.execute(cashier).permissions).not.toContain(
      'school_lists.templates.manage',
    );
    expect(useCase.execute(cashier).permissions).toContain(
      'school_lists.payments.register',
    );
    expect(useCase.execute(supervisor).permissions).toEqual(
      expect.arrayContaining([
        'school_lists.prices.override',
        'school_lists.quotations.cancel',
      ]),
    );
    expect(useCase.execute(supervisor).permissions).not.toContain(
      'school_lists.payments.void',
    );
    expect(useCase.execute(admin).permissions).toHaveLength(11);
    expect(useCase.execute(supervisor).permissions).toContain(
      'school_lists.supply.manage',
    );
    expect(useCase.execute(cashier).permissions).not.toContain(
      'school_lists.supply.manage',
    );
    expect(useCase.execute({ userId: 'x', role: 'GUEST' }).permissions).toEqual(
      [],
    );
  });

  it('only administrators manage templates', async () => {
    const repo = repository();
    const useCase = new SaveSchoolTemplateUseCase(repo);
    await expect(
      useCase.execute(
        cashier,
        null,
        { name: 'X', grade: 'Y', items: [] },
        null,
      ),
    ).rejects.toMatchObject({ code: 'SCHOOL_LIST_FORBIDDEN', status: 403 });
    expect(repo.saveTemplate).not.toHaveBeenCalled();

    await useCase.execute(admin, 't1', { name: 'X', grade: 'Y', items: [] }, 3);
    expect(repo.saveTemplate).toHaveBeenCalledWith(
      't1',
      { name: 'X', grade: 'Y', items: [] },
      'u-admin',
      3,
    );
  });

  it('inactive templates are listed only for administrators', async () => {
    const repo = repository();
    const useCase = new ListSchoolTemplatesUseCase(repo);
    await useCase.execute(cashier, true);
    expect(repo.listTemplates).toHaveBeenLastCalledWith(false);
    await useCase.execute(admin, true);
    expect(repo.listTemplates).toHaveBeenLastCalledWith(true);
  });

  it('creates a quotation with an idempotency key and today as default date', async () => {
    const repo = repository();
    const result = await new CreateSchoolQuotationUseCase(repo).execute(
      cashier,
      quotationInput,
      REQUEST_ID,
    );
    expect(repo.createQuotation).toHaveBeenCalledWith(
      { ...quotationInput, quotationDate: guatemalaToday() },
      'u-user',
      `SLQ:${REQUEST_ID}`,
    );
    expect(result.quotationNumber).toBe('LE-000001');
  });

  it('rejects an invalid anticipo before touching the database', async () => {
    const repo = repository();
    const useCase = new CreateSchoolQuotationUseCase(repo);
    for (const amount of [0, -5, 1.005, Number.NaN]) {
      await expect(
        useCase.execute(
          cashier,
          { ...quotationInput, advance: { amount, paymentMethod: 'EFECTIVO' } },
          REQUEST_ID,
        ),
      ).rejects.toMatchObject({ code: 'SCHOOL_INVALID_AMOUNT' });
    }
    await expect(
      useCase.execute(cashier, quotationInput, ''),
    ).rejects.toMatchObject({ code: 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED' });
    expect(repo.createQuotation).not.toHaveBeenCalled();
  });

  it('an edit never carries payments', async () => {
    const repo = repository();
    await new UpdateSchoolQuotationUseCase(repo).execute(
      cashier,
      'q1',
      { ...quotationInput, advance: { amount: 10, paymentMethod: 'EFECTIVO' } },
      2,
    );
    expect(repo.updateQuotation).toHaveBeenCalledWith(
      'q1',
      expect.objectContaining({ advance: null }),
      'u-user',
      2,
    );
  });

  it('registers a payment and returns the refreshed account statement', async () => {
    const repo = repository();
    const result = await new RegisterSchoolPaymentUseCase(repo).execute(
      cashier,
      'q1',
      { amount: 150, paymentMethod: 'TRANSFERENCIA', reference: 'TRX-1' },
      REQUEST_ID,
    );
    expect(repo.registerPayment).toHaveBeenCalledWith(
      'q1',
      { amount: 150, paymentMethod: 'TRANSFERENCIA', reference: 'TRX-1' },
      'u-user',
      `SLP:${REQUEST_ID}`,
    );
    expect(result).toEqual({ paymentId: 'p2', quotation: detail });
  });

  it('voiding a payment is for administrators and requires the payment to exist', async () => {
    const repo = repository();
    const useCase = new VoidSchoolPaymentUseCase(repo);
    await expect(
      useCase.execute(supervisor, 'p1', 'Error de digitación', REQUEST_ID),
    ).rejects.toMatchObject({ code: 'SCHOOL_LIST_FORBIDDEN' });
    repo.findPayment.mockResolvedValueOnce(null);
    await expect(
      useCase.execute(admin, 'p404', 'Error de digitación', REQUEST_ID),
    ).rejects.toMatchObject({ code: 'SCHOOL_PAYMENT_NOT_FOUND', status: 404 });
    const result = await useCase.execute(
      admin,
      'p1',
      'Error de digitación',
      REQUEST_ID,
    );
    expect(repo.voidPayment).toHaveBeenCalledWith(
      'p1',
      'Error de digitación',
      'u-admin',
      `SLV:${REQUEST_ID}`,
    );
    expect(result.reversalId).toBe('p3');
  });

  it('cancelling is for supervisors and administrators', async () => {
    const repo = repository();
    const useCase = new CancelSchoolQuotationUseCase(repo);
    await expect(
      useCase.execute(cashier, 'q1', { reason: 'Desiste' }, REQUEST_ID),
    ).rejects.toBeInstanceOf(SchoolListRuleError);
    await useCase.execute(
      supervisor,
      'q1',
      { reason: 'El cliente desiste', refundMethod: 'EFECTIVO' },
      REQUEST_ID,
    );
    expect(repo.cancelQuotation).toHaveBeenCalledWith(
      'q1',
      { reason: 'El cliente desiste', refundMethod: 'EFECTIVO' },
      'u-sup',
      `SLC:${REQUEST_ID}`,
    );
  });

  it('marks a quotation as TERMINADA (dispatched) with the edit permission', async () => {
    const repo = repository();
    const useCase = new ChangeSchoolQuotationStatusUseCase(repo);
    await useCase.execute(cashier, 'q1', 'TERMINAR', 2);
    expect(repo.changeStatus).toHaveBeenCalledWith(
      'q1',
      'TERMINAR',
      'u-user',
      2,
    );
    await expect(
      useCase.execute({ userId: 'x', role: 'GUEST' }, 'q1', 'TERMINAR', 2),
    ).rejects.toMatchObject({ code: 'SCHOOL_LIST_FORBIDDEN' });
  });

  it('saves the preparation assignments with the edit permission and rejects a repeated product', async () => {
    const repo = repository();
    const useCase = new SaveSchoolPreparationUseCase(repo);
    const assignments = [
      { itemId: 'i1', productId: 'p1', quantity: 3 },
      { itemId: 'i1', productId: 'p2', quantity: 2 },
    ];
    await useCase.execute(cashier, 'q1', assignments, 4);
    expect(repo.savePreparation).toHaveBeenCalledWith(
      'q1',
      assignments,
      'u-user',
      4,
    );
    await expect(
      useCase.execute(
        cashier,
        'q1',
        [assignments[0], { ...assignments[0], quantity: 1 }],
        4,
      ),
    ).rejects.toMatchObject({ code: 'SCHOOL_DUPLICATE_ASSIGNMENT' });
    await expect(
      useCase.execute({ userId: 'x', role: 'GUEST' }, 'q1', assignments, 4),
    ).rejects.toMatchObject({ code: 'SCHOOL_LIST_FORBIDDEN' });
    expect(repo.savePreparation).toHaveBeenCalledTimes(1);
  });

  it('only a super administrator previews or purges every quotation, with the typed phrase', async () => {
    const repo = repository();
    const superAdmin = { userId: 'u-root', role: 'SUPER_ADMIN' };
    const preview = new PreviewSchoolQuotationPurgeUseCase(repo);
    const purge = new PurgeSchoolQuotationsUseCase(repo);
    await expect(preview.execute(superAdmin)).resolves.toEqual(purgeSummary);
    for (const role of ['ADMIN', 'SUPERVISOR_DE_TURNO', 'USER']) {
      await expect(
        purge.execute({ userId: 'x', role }, 'BORRAR TODO'),
      ).rejects.toMatchObject({ code: 'SCHOOL_LIST_FORBIDDEN' });
      await expect(
        preview.execute({ userId: 'x', role }),
      ).rejects.toMatchObject({ code: 'SCHOOL_LIST_FORBIDDEN' });
    }
    await expect(
      purge.execute(superAdmin, 'borrar todo'),
    ).rejects.toMatchObject({ code: 'SCHOOL_PURGE_CONFIRMATION' });
    expect(repo.purgeQuotations).not.toHaveBeenCalled();
    await expect(purge.execute(superAdmin, 'BORRAR TODO')).resolves.toEqual(
      purgeSummary,
    );
    expect(repo.purgeQuotations).toHaveBeenCalledWith('u-root', 'BORRAR TODO');
  });

  it('only a super administrator deletes one quotation, typing its number', async () => {
    const repo = repository();
    const superAdmin = { userId: 'u-root', role: 'SUPER_ADMIN' };
    const remove = new DeleteSchoolQuotationUseCase(repo);
    const preview = new PreviewSchoolQuotationDeleteUseCase(repo);
    await expect(
      remove.execute({ userId: 'x', role: 'ADMIN' }, 'q1', 'LE-000001'),
    ).rejects.toMatchObject({ code: 'SCHOOL_LIST_FORBIDDEN' });
    await expect(remove.execute(superAdmin, 'q1', '  ')).rejects.toMatchObject({
      code: 'SCHOOL_DELETE_CONFIRMATION',
    });
    expect(repo.deleteQuotation).not.toHaveBeenCalled();
    await remove.execute(superAdmin, 'q1', 'LE-000001');
    expect(repo.deleteQuotation).toHaveBeenCalledWith(
      'q1',
      'u-root',
      'LE-000001',
    );
    await expect(preview.execute(superAdmin, 'q1')).resolves.toEqual(
      purgeSummary,
    );
    expect(repo.purgePreview).toHaveBeenCalledWith('q1');
    repo.purgePreview.mockResolvedValueOnce({ ...purgeSummary, quotations: 0 });
    await expect(preview.execute(superAdmin, 'nope')).rejects.toMatchObject({
      code: 'SCHOOL_QUOTE_NOT_FOUND',
    });
  });

  it('reads Bodega stock for the editor (deduplicated) with the view permission', async () => {
    const repo = repository();
    const result = await new GetSchoolBodegaStockUseCase(repo).execute(
      cashier,
      ['p1', 'p1'],
    );
    expect(repo.bodegaStock).toHaveBeenCalledWith(['p1']);
    expect(result).toEqual([{ productId: 'p1', quantity: 7 }]);
  });

  it('supply actions: managers allocate, admins switch the mode, everyone dispatches with a key', async () => {
    const repo = repository();
    await expect(
      new RunSupplyFifoUseCase(repo).execute(cashier, null),
    ).rejects.toMatchObject({ code: 'SCHOOL_LIST_FORBIDDEN' });
    expect(
      await new RunSupplyFifoUseCase(repo).execute(supervisor, 'p1'),
    ).toEqual({
      allocated: 3,
    });
    expect(repo.runFifo).toHaveBeenCalledWith('p1', 'u-sup');
    expect(
      await new AllocateSupplyPurchaseUseCase(repo).execute(supervisor, 'pu1'),
    ).toEqual({ allocated: 5 });

    await expect(
      new SetSupplySettingsUseCase(repo).execute(supervisor, 'MANUAL'),
    ).rejects.toMatchObject({ code: 'SCHOOL_LIST_FORBIDDEN' });
    expect(
      await new SetSupplySettingsUseCase(repo).execute(admin, 'MANUAL'),
    ).toEqual({ allocationMode: 'MANUAL' });

    const manual = new AllocateSupplyManualUseCase(repo);
    await expect(
      manual.execute(
        supervisor,
        { quotationId: 'q1', productId: 'p1', quantity: 0 },
        REQUEST_ID,
      ),
    ).rejects.toMatchObject({ code: 'SCHOOL_INVALID_QUANTITY' });
    await manual.execute(
      supervisor,
      { quotationId: 'q1', productId: 'p1', quantity: 2 },
      REQUEST_ID,
    );
    expect(repo.allocateManual).toHaveBeenCalledWith(
      { quotationId: 'q1', productId: 'p1', quantity: 2, purchaseId: null },
      'u-sup',
      `SLA:${REQUEST_ID}`,
    );

    await new DispatchSchoolQuotationUseCase(repo).execute(
      cashier,
      'q1',
      'Entregada',
      REQUEST_ID,
    );
    expect(repo.dispatch).toHaveBeenCalledWith(
      'q1',
      'Entregada',
      'u-user',
      `SLD:${REQUEST_ID}`,
    );
    await expect(
      new DispatchSchoolQuotationUseCase(repo).execute(cashier, 'q1', null, ''),
    ).rejects.toMatchObject({ code: 'SCHOOL_IDEMPOTENCY_KEY_REQUIRED' });
  });

  it('dashboard defaults to the current year and rejects inverted ranges', async () => {
    const repo = repository();
    const useCase = new GetSchoolListDashboardUseCase(repo);
    const today = guatemalaToday();
    const result = await useCase.execute(cashier);
    expect(repo.dashboard).toHaveBeenCalledWith(
      `${today.slice(0, 4)}-01-01`,
      today,
    );
    expect(result.dateTo).toBe(today);
    await expect(
      useCase.execute(cashier, '2099-02-01', '2099-01-01'),
    ).rejects.toMatchObject({ code: 'SCHOOL_INVALID_DATE_RANGE' });
  });

  it('builds the quotation PDF from the saved copy and a receipt per payment', async () => {
    const repo = repository();
    const quotation = await new GetSchoolQuotationPdfUseCase(
      repo,
      company,
    ).execute(cashier, 'q1');
    expect(quotation.filename).toBe('LE-000001.pdf');
    expect(quotation.pdf.subarray(0, 4).toString()).toBe('%PDF');

    const receipt = await new GetSchoolReceiptPdfUseCase(repo, company).execute(
      cashier,
      'p1',
    );
    expect(receipt.filename).toBe('RLE-000001.pdf');
    expect(receipt.pdf.subarray(0, 4).toString()).toBe('%PDF');

    repo.findPayment.mockResolvedValueOnce(null);
    await expect(
      new GetSchoolReceiptPdfUseCase(repo, company).execute(cashier, 'nope'),
    ).rejects.toMatchObject({ code: 'SCHOOL_PAYMENT_NOT_FOUND' });
  });

  it('assertPositiveMoney accepts cents only', () => {
    expect(() => assertPositiveMoney(0.01)).not.toThrow();
    expect(() => assertPositiveMoney(850.5)).not.toThrow();
    expect(() => assertPositiveMoney(0.001)).toThrow();
    expect(() => assertPositiveMoney(Infinity)).toThrow();
  });
});
