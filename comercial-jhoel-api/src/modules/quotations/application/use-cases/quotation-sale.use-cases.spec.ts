import type { QuotationRepository } from '../../domain/repositories/quotation.repository';
import { Quotation } from '../../domain/entities/quotation.entity';
import {
  ChangeQuotationStatusUseCase,
  ConvertQuotationToSaleUseCase,
  GetQuotationSalePreviewUseCase,
} from './quotation-sale.use-cases';
import { QuotationAccessDeniedError } from '../../domain/errors/quotation-access-denied.error';
import { quotationRuleErrorFromMessage } from '../../domain/errors/quotation-rule.error';

function quotation(
  status: Quotation['status'],
  overrides: Partial<{ userId: string; expirationDate: string }> = {},
): Quotation {
  return Quotation.create({
    id: 'q1',
    quotationNumber: 'COT-000001',
    clientId: null,
    clientName: 'María López',
    customerPhone: '5555-1234',
    studentName: null,
    grade: null,
    userId: overrides.userId ?? 'user-1',
    username: 'cajero',
    quotationDate: new Date('2099-01-01T00:00:00Z'),
    expirationDate: overrides.expirationDate ?? '2099-12-31',
    subtotal: 100,
    discount: 5,
    total: 95,
    observations: null,
    commercialTerms: null,
    status,
    voidedAt: null,
    voidedBy: null,
    voidedByUsername: null,
    voidReason: null,
    convertedToSaleId: status === 'VENDIDA' ? 'sale-1' : null,
    acceptedAt: null,
    rejectedAt: null,
    rejectReason: null,
    soldAt: null,
    soldByUsername: null,
    items: [],
    createdAt: new Date('2099-01-01T00:00:00Z'),
    updatedAt: new Date('2099-01-01T00:00:00Z'),
  });
}

function repository(current: Quotation): jest.Mocked<QuotationRepository> {
  return {
    createQuotation: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(current),
    changeStatus: jest.fn().mockResolvedValue(quotation('ACEPTADA')),
    convertToSale: jest.fn().mockResolvedValue('sale-1'),
    salePreview: jest.fn().mockResolvedValue([
      {
        productId: 'p1',
        productName: 'Cuaderno',
        quantity: 4,
        unitPrice: 25,
        total: 95,
        available: 3,
        isActive: true,
        sufficient: false,
      },
    ]),
  };
}

const owner = { currentUserId: 'user-1', isAdmin: false };
const stranger = { currentUserId: 'user-2', isAdmin: false };

describe('Cotizaciones — estados y "Confirmar venta"', () => {
  it('changes the commercial status only for the owner (or an admin)', async () => {
    const repo = repository(quotation('COTIZADA'));
    const useCase = new ChangeQuotationStatusUseCase(repo);
    await expect(
      useCase.execute('q1', 'ACEPTAR', null, stranger),
    ).rejects.toBeInstanceOf(QuotationAccessDeniedError);
    const result = await useCase.execute('q1', 'ACEPTAR', null, owner);
    expect(repo.changeStatus).toHaveBeenCalledWith(
      'q1',
      'ACEPTAR',
      'user-1',
      null,
    );
    expect(result.status).toBe('ACEPTADA');
  });

  it('the sale preview blocks confirmation when Vitrina lacks stock', async () => {
    const preview = await new GetQuotationSalePreviewUseCase(
      repository(quotation('ACEPTADA')),
    ).execute('q1', owner);
    expect(preview.canConfirm).toBe(false);
    expect(preview.lines[0]).toEqual(
      expect.objectContaining({ available: 3, sufficient: false }),
    );
  });

  it('a draft or a sold quotation is never confirmable from the preview', async () => {
    const repo = repository(quotation('BORRADOR'));
    repo.salePreview.mockResolvedValue([
      {
        productId: 'p1',
        productName: 'Cuaderno',
        quantity: 1,
        unitPrice: 25,
        total: 25,
        available: 9,
        isActive: true,
        sufficient: true,
      },
    ]);
    expect(
      (await new GetQuotationSalePreviewUseCase(repo).execute('q1', owner))
        .canConfirm,
    ).toBe(false);
  });

  it('converts through the repository (SQL keeps it idempotent) and returns the sale', async () => {
    const repo = repository(quotation('ACEPTADA'));
    const result = await new ConvertQuotationToSaleUseCase(repo).execute(
      'q1',
      owner,
    );
    expect(repo.convertToSale).toHaveBeenCalledWith('q1', 'user-1');
    expect(result.saleId).toBe('sale-1');
    await expect(
      new ConvertQuotationToSaleUseCase(repo).execute('q1', stranger),
    ).rejects.toBeInstanceOf(QuotationAccessDeniedError);
  });

  it('maps the SQL rules to clear messages', () => {
    expect(
      quotationRuleErrorFromMessage(
        'QUOTATION_INSUFFICIENT_STOCK:3:4:Cuaderno 100 hojas: rayado',
      ),
    ).toMatchObject({
      status: 409,
      message:
        'No hay existencias suficientes de "Cuaderno 100 hojas: rayado" en Vitrina: disponibles 3, se necesitan 4.',
    });
    expect(
      quotationRuleErrorFromMessage('QUOTATION_ALREADY_SOLD')?.status,
    ).toBe(409);
    expect(quotationRuleErrorFromMessage('PRODUCT_NOT_FOUND:x')).toBeNull();
  });
});
