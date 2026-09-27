import { GetBankBalanceStripUseCase } from './get-bank-balance-strip.use-case';
import { Bank } from '../../domain/entities/bank.entity';
import { BankSpecialAccount } from '../../domain/entities/bank-account-movement.entity';
import { BankRepository } from '../../domain/repositories/bank.repository';
import { BankMovementRepository } from '../../domain/repositories/bank-movement.repository';

function bank(
  id: string,
  specialAccount: BankSpecialAccount | null,
  availableInTransaccionar = true,
): Bank {
  return Bank.create({
    id,
    name: `Banco ${id}`,
    accountNumber: `00${id}`,
    accountTypeId: 'type',
    accountTypeName: 'Monetaria',
    previousBalance: 0,
    finalBalance: 1000,
    specialAccount,
    maxBalance: null,
    availableInTransaccionar,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'u',
    createdByUsername: 'u',
    updatedBy: null,
    updatedByUsername: null,
  });
}

describe('GetBankBalanceStripUseCase', () => {
  async function run(banks: Bank[], changes: [string, number][]) {
    const bankRepository = {
      findAll: jest.fn().mockResolvedValue(banks),
    } as unknown as BankRepository;
    const movementRepository = {
      getLastMovementByBank: jest
        .fn()
        .mockResolvedValue(
          new Map(
            changes.map(([id, amount]) => [
              id,
              { amount, createdAt: new Date('2026-09-26T10:00:00Z') },
            ]),
          ),
        ),
    } as unknown as BankMovementRepository;
    return new GetBankBalanceStripUseCase(
      bankRepository,
      movementRepository,
    ).execute();
  }

  it('usa la última transacción: subida en verde, bajada en rojo (cuenta normal)', async () => {
    const [up, down, flat] = await run(
      [bank('a', null), bank('b', null), bank('c', null)],
      [
        ['a', 500],
        ['b', -200],
      ],
    );
    expect(up).toEqual(
      expect.objectContaining({
        trend: 'UP',
        trendTone: 'POSITIVE',
        lastChange: 500,
      }),
    );
    expect(down).toEqual(
      expect.objectContaining({ trend: 'DOWN', trendTone: 'NEGATIVE' }),
    );
    expect(flat).toEqual(
      expect.objectContaining({
        trend: 'FLAT',
        trendTone: 'NEUTRAL',
        lastChange: 0,
        lastMovementAt: null,
      }),
    );
  });

  it('invierte el color para Génesis y BI Club (bajar es favorable)', async () => {
    const [genesis, biClub] = await run(
      [bank('g', 'GENESIS'), bank('bi', 'BI_CLUB')],
      [
        ['g', -3000],
        ['bi', 1000],
      ],
    );
    expect(genesis).toEqual(
      expect.objectContaining({ trend: 'DOWN', trendTone: 'POSITIVE' }),
    );
    expect(biClub).toEqual(
      expect.objectContaining({ trend: 'UP', trendTone: 'NEGATIVE' }),
    );
  });

  it('muestra solo cuentas "En Transaccionar", más Génesis y BI Club siempre', async () => {
    const items = await run(
      [
        bank('on', null, true),
        bank('off', null, false),
        bank('g', 'GENESIS', false),
        bank('bi', 'BI_CLUB', false),
      ],
      [],
    );
    expect(items.map((item) => item.bankId)).toEqual(['on', 'g', 'bi']);
  });
});
