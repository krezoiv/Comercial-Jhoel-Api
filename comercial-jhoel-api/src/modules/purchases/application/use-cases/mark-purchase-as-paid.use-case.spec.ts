import { MarkPurchaseAsPaidUseCase } from './mark-purchase-as-paid.use-case';
import { PurchaseRepository } from '../../domain/repositories/purchase.repository';
import { PurchaseNotFoundError } from '../../domain/errors/purchase-not-found.error';
import { PurchaseAlreadyPaidError } from '../../domain/errors/purchase-already-paid.error';
import { Purchase } from '../../domain/entities/purchase.entity';

function makePurchase(paymentStatus: 'PENDING' | 'PAID'): Purchase {
  return Purchase.create({
    id: 'purchase-1',
    supplierId: 'supplier-1',
    supplierName: 'Distribuidora Central',
    userId: 'user-1',
    username: 'cajero1',
    purchaseDate: new Date('2026-09-01T00:00:00Z'),
    total: 1500,
    items: [],
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-09-01T00:00:00Z'),
    paymentType: 'CREDITO',
    paymentDueDate: '2026-09-10',
    paymentStatus,
    paidAt: null,
    paidBy: null,
    paidByUsername: null,
  });
}

describe('MarkPurchaseAsPaidUseCase', () => {
  let repository: jest.Mocked<PurchaseRepository>;
  let useCase: MarkPurchaseAsPaidUseCase;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      markAsPaid: jest.fn(),
    } as unknown as jest.Mocked<PurchaseRepository>;
    useCase = new MarkPurchaseAsPaidUseCase(repository);
  });

  it('throws PurchaseNotFoundError when the purchase does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'missing', paidBy: 'user-1' }),
    ).rejects.toThrow(PurchaseNotFoundError);
    expect(repository.markAsPaid).not.toHaveBeenCalled();
  });

  it('throws PurchaseAlreadyPaidError when the purchase is already paid', async () => {
    repository.findById.mockResolvedValue(makePurchase('PAID'));

    await expect(
      useCase.execute({ id: 'purchase-1', paidBy: 'user-1' }),
    ).rejects.toThrow(PurchaseAlreadyPaidError);
    expect(repository.markAsPaid).not.toHaveBeenCalled();
  });

  it('marks a pending purchase as paid by the given user', async () => {
    repository.findById.mockResolvedValue(makePurchase('PENDING'));
    repository.markAsPaid.mockResolvedValue(makePurchase('PAID'));

    const result = await useCase.execute({
      id: 'purchase-1',
      paidBy: 'user-2',
    });

    expect(repository.markAsPaid).toHaveBeenCalledWith('purchase-1', 'user-2');
    expect(result.paymentStatus).toBe('PAID');
  });
});
