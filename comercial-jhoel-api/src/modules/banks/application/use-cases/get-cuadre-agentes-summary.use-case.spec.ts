import { GetCuadreAgentesSummaryUseCase } from './get-cuadre-agentes-summary.use-case';
import { Bank } from '../../domain/entities/bank.entity';
import { BankSpecialAccount } from '../../domain/entities/bank-account-movement.entity';
import { BankRepository } from '../../domain/repositories/bank.repository';
import { AssetRepository } from '../../../assets/domain/repositories/asset.repository';
import { AccountReceivableRepository } from '../../../accounts-receivable/domain/repositories/account-receivable.repository';

function bank(
  id: string,
  finalBalance: number,
  specialAccount: BankSpecialAccount | null,
  accountTypeName = 'Monetaria',
): Bank {
  return Bank.create({
    id,
    name: `Banco ${id}`,
    accountNumber: `00${id}`,
    accountTypeId: 'type',
    accountTypeName,
    previousBalance: 0,
    finalBalance,
    specialAccount,
    maxBalance: specialAccount === 'BI_CLUB' ? 75000 : null,
    availableInTransaccionar: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'u',
    createdByUsername: 'u',
    updatedBy: null,
    updatedByUsername: null,
  });
}

async function run(banks: Bank[]) {
  const bankRepository = {
    findAll: jest.fn().mockResolvedValue(banks),
  } as unknown as BankRepository;
  const assetRepository = {
    getReportSummary: jest.fn().mockResolvedValue({ totalAmount: 0 }),
  } as unknown as AssetRepository;
  const receivableRepository = {
    getReportSummary: jest.fn().mockResolvedValue({ totalAmount: 0 }),
  } as unknown as AccountReceivableRepository;
  return new GetCuadreAgentesSummaryUseCase(
    bankRepository,
    assetRepository,
    receivableRepository,
  ).execute();
}

describe('GetCuadreAgentesSummaryUseCase — BI Club como línea de crédito', () => {
  it('clasifica BI Club como línea de crédito aunque su tipo de cuenta no diga "crédito"', async () => {
    const summary = await run([bank('bi', -25000, 'BI_CLUB', 'Monetaria')]);
    expect(summary.banks[0]).toEqual(
      expect.objectContaining({
        calculationType: 'subtract',
        finalBalance: -25000,
      }),
    );
  });

  it('conserva el signo real del saldo (nunca Math.abs)', async () => {
    const summary = await run([bank('bi', -75000, 'BI_CLUB', 'Linea Crédito')]);
    expect(summary.banks[0].finalBalance).toBe(-75000);
    expect(summary.totalCreditLines).toBe(-75000);
  });

  it('Banco Industrial → BI Club no cambia el total de bancos (transferencia entre cuentas propias)', async () => {
    // Antes: Banco Industrial Q100,000, BI Club Q0.
    const before = await run([
      bank('ind', 100000, 'BANCO_INDUSTRIAL'),
      bank('bi', 0, 'BI_CLUB', 'Linea Crédito'),
    ]);
    // Después de usar Q75,000: ambos restan Q75,000.
    const afterUse = await run([
      bank('ind', 25000, 'BANCO_INDUSTRIAL'),
      bank('bi', -75000, 'BI_CLUB', 'Linea Crédito'),
    ]);
    // Después de devolver Q50,000: ambos suman Q50,000.
    const afterPayment = await run([
      bank('ind', 75000, 'BANCO_INDUSTRIAL'),
      bank('bi', -25000, 'BI_CLUB', 'Linea Crédito'),
    ]);
    expect(before.totalBanks).toBe(100000);
    expect(afterUse.totalBanks).toBe(100000);
    expect(afterPayment.totalBanks).toBe(100000);
  });
});
