import { Inject, Injectable } from '@nestjs/common';
import { BANK_REPOSITORY } from '../../domain/repositories/bank.repository';
import type { BankRepository } from '../../domain/repositories/bank.repository';
import { BANK_MOVEMENT_REPOSITORY } from '../../domain/repositories/bank-movement.repository';
import type { BankMovementRepository } from '../../domain/repositories/bank-movement.repository';
import { BankSpecialAccount } from '../../domain/entities/bank-account-movement.entity';

export type BankBalanceTrend = 'UP' | 'DOWN' | 'FLAT';
export type BankBalanceTrendTone = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export interface BankBalanceStripItem {
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountTypeName: string;
  specialAccount: BankSpecialAccount | null;
  currentBalance: number;
  /** Monto con signo de la última transacción de la cuenta (0 si nunca tuvo una). */
  lastChange: number;
  /** Cuándo ocurrió esa última transacción (`null` si nunca tuvo una). */
  lastMovementAt: Date | null;
  trend: BankBalanceTrend;
  /** Color de la flecha: para Génesis es inverso (bajar es bueno). */
  trendTone: BankBalanceTrendTone;
}

/**
 * Cuentas cuyo saldo se lee "al revés": que baje es favorable. Génesis
 * (línea de crédito) — pedido explícito del negocio. BI Club Empresarial
 * estaba aquí mientras su saldo era "lo recibido de Banco Industrial"
 * (bajar = devolver). Desde `BiClubCreditLine` su saldo es ≤ 0 y devolver lo
 * SUBE hacia cero, así que el mismo criterio (usar la línea = desfavorable,
 * devolver = favorable) se obtiene con el tono normal.
 */
const INVERSE_TONE_ACCOUNTS: ReadonlySet<BankSpecialAccount> = new Set([
  'GENESIS',
]);

/** Siempre visibles en la tira aunque no estén habilitadas en Transaccionar. */
const ALWAYS_VISIBLE_ACCOUNTS: ReadonlySet<BankSpecialAccount> = new Set([
  'GENESIS',
  'BI_CLUB',
]);

/**
 * La "tira de saldos" de Transaccionar y del Resumen: saldo actual de las
 * cuentas principales (las marcadas "En Transaccionar" en Sistema → Bancos,
 * más Génesis y BI Club) y si su ÚLTIMA transacción subió o bajó el saldo.
 * Todo se calcula aquí, a partir del ledger — el frontend solo pinta
 * `trend`/`trendTone`.
 */
@Injectable()
export class GetBankBalanceStripUseCase {
  constructor(
    @Inject(BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankMovementRepository: BankMovementRepository,
  ) {}

  async execute(): Promise<BankBalanceStripItem[]> {
    const [banks, changes] = await Promise.all([
      this.bankRepository.findAll({ activeOnly: true }),
      this.bankMovementRepository.getLastMovementByBank(),
    ]);

    return banks
      .filter(
        (bank) =>
          bank.availableInTransaccionar ||
          (bank.specialAccount !== null &&
            ALWAYS_VISIBLE_ACCOUNTS.has(bank.specialAccount)),
      )
      .map((bank) => {
        const last = changes.get(bank.id);
        const lastChange = last?.amount ?? 0;
        const trend: BankBalanceTrend =
          lastChange > 0 ? 'UP' : lastChange < 0 ? 'DOWN' : 'FLAT';
        const inverse =
          bank.specialAccount !== null &&
          INVERSE_TONE_ACCOUNTS.has(bank.specialAccount);
        const favorable = inverse ? trend === 'DOWN' : trend === 'UP';
        const trendTone: BankBalanceTrendTone =
          trend === 'FLAT' ? 'NEUTRAL' : favorable ? 'POSITIVE' : 'NEGATIVE';
        return {
          bankId: bank.id,
          bankName: bank.name,
          accountNumber: bank.accountNumber,
          accountTypeName: bank.accountTypeName,
          specialAccount: bank.specialAccount,
          currentBalance: bank.finalBalance,
          lastChange,
          lastMovementAt: last?.createdAt ?? null,
          trend,
          trendTone,
        };
      });
  }
}
