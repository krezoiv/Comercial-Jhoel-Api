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
  it('suma el saldo de BI Club con su signo real aunque su tipo diga "crédito" (el saldo ya es la deuda)', async () => {
    const summary = await run([
      bank('bi', -25000, 'BI_CLUB', 'Linea Crédito'),
      bank('gen', 1000, 'GENESIS', 'Linea Crédito'),
    ]);
    expect(summary.banks[0]).toEqual(
      expect.objectContaining({ calculationType: 'sum', finalBalance: -25000 }),
    );
    // Génesis sigue siendo "subtract" por su tipo de cuenta.
    expect(summary.banks[1].calculationType).toBe('subtract');
  });

  it('conserva el signo real del saldo (nunca Math.abs): la deuda reduce el total', async () => {
    const summary = await run([bank('bi', -75000, 'BI_CLUB', 'Linea Crédito')]);
    expect(summary.banks[0].finalBalance).toBe(-75000);
    expect(summary.totalBanks).toBe(-75000);
  });

  it('usar y pagar la línea (BI Club ↔ Banco Industrial) no cambia el total de bancos', async () => {
    // Inicio: Banco Industrial Q10,000, BI Club Q0.
    const before = await run([
      bank('ind', 10000, 'BANCO_INDUSTRIAL'),
      bank('bi', 0, 'BI_CLUB', 'Linea Crédito'),
    ]);
    // Uso: BI Club → Banco Industrial Q75,000.
    const afterUse = await run([
      bank('ind', 85000, 'BANCO_INDUSTRIAL'),
      bank('bi', -75000, 'BI_CLUB', 'Linea Crédito'),
    ]);
    // Pago: Banco Industrial → BI Club Q75,000.
    const afterPayment = await run([
      bank('ind', 10000, 'BANCO_INDUSTRIAL'),
      bank('bi', 0, 'BI_CLUB', 'Linea Crédito'),
    ]);
    expect(before.totalBanks).toBe(10000);
    expect(afterUse.totalBanks).toBe(10000);
    expect(afterPayment.totalBanks).toBe(10000);
  });
});
