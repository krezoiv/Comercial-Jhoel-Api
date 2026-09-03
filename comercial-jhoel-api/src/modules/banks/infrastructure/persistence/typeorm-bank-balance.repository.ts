import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { BankBalanceView } from '../../domain/entities/bank-balance-view.entity';
import {
  BankBalanceRepository,
  SaveBankBalancesData,
} from '../../domain/repositories/bank-balance.repository';
import { BankNotFoundError } from '../../domain/errors/bank-not-found.error';
import { BankInactiveError } from '../../domain/errors/bank-inactive.error';
import {
  InvalidBankBalanceDateError,
  InvalidBankFinalBalanceError,
} from '../../domain/errors/invalid-bank-balance.error';
import { BankOrmEntity } from './bank.orm-entity';
import { BankBalanceOrmEntity } from './bank-balance.orm-entity';

@Injectable()
export class TypeOrmBankBalanceRepository implements BankBalanceRepository {
  constructor(
    @InjectRepository(BankOrmEntity)
    private readonly bankRepository: Repository<BankOrmEntity>,
    @InjectRepository(BankBalanceOrmEntity)
    private readonly bankBalanceRepository: Repository<BankBalanceOrmEntity>,
  ) {}

  /**
   * Resolves the same two values `save_bank_balance()` (migration
   * `1757900000000-CreateBankAgentsModule`, refined by
   * `1758500000000-OnlySyncBanksFinalBalanceForLatestDate`) computes on the
   * write side, but as a read-only projection — kept in sync by hand rather
   * than calling the function, since this is a `SELECT`, not a mutation:
   * `previousBalance` is the most recent `bank_balances.finalBalance`
   * strictly before `operationDate`, falling back to the bank's own
   * `banks.previousBalance` (its configured opening balance) when this bank
   * has no `bank_balances` history before that date yet; `finalBalance` is
   * `null` unless a row already exists for *exactly* this date (nothing
   * saved yet for that bank/date pair renders as an empty input, not a
   * stale one). Uses `getRawMany()` (a query-builder join across two
   * subqueries, not `find()`), so the numeric columns come back as strings
   * with no `DecimalColumnTransformer` applied — `parseFloat` below is what
   * that transformer would otherwise have done automatically.
   */
  async findBalancesView(operationDate: string): Promise<BankBalanceView[]> {
    const qb = this.bankRepository
      .createQueryBuilder('bank')
      .innerJoin('bank.accountType', 'accountType')
      .where('bank.isActive = true')
      .orderBy('bank.name', 'ASC');

    qb.select('bank.id', 'bankId')
      .addSelect('bank.name', 'bankName')
      .addSelect('bank.accountNumber', 'accountNumber')
      .addSelect('accountType.name', 'accountTypeName')
      .addSelect(
        (subQb) =>
          subQb
            .select('previous.finalBalance', 'value')
            .from(BankBalanceOrmEntity, 'previous')
            .where('previous.bankId = bank.id')
            .andWhere('previous.operationDate < :operationDate')
            .orderBy('previous.operationDate', 'DESC')
            .limit(1),
        'lastFinalBalance',
      )
      .addSelect('bank.previousBalance', 'bankPreviousBalance')
      .addSelect(
        (subQb) =>
          subQb
            .select('current.finalBalance', 'value')
            .from(BankBalanceOrmEntity, 'current')
            .where('current.bankId = bank.id')
            .andWhere('current.operationDate = :operationDate'),
        'savedFinalBalance',
      )
      .setParameter('operationDate', operationDate);

    const rows = await qb.getRawMany<{
      bankId: string;
      bankName: string;
      accountNumber: string;
      accountTypeName: string;
      lastFinalBalance: string | null;
      bankPreviousBalance: string;
      savedFinalBalance: string | null;
    }>();

    return rows.map((row) => ({
      bankId: row.bankId,
      bankName: row.bankName,
      accountNumber: row.accountNumber,
      accountTypeName: row.accountTypeName,
      previousBalance: parseFloat(
        row.lastFinalBalance ?? row.bankPreviousBalance ?? '0',
      ),
      finalBalance:
        row.savedFinalBalance !== null
          ? parseFloat(row.savedFinalBalance)
          : null,
    }));
  }

  /** One outer TypeORM transaction wrapping one `save_bank_balance()` call per entry — the whole "Guardar Cambios" batch commits or rolls back together, per `SaveBankBalancesUseCase`'s own doc comment. */
  async saveBalances(data: SaveBankBalancesData): Promise<number> {
    try {
      await this.bankBalanceRepository.manager.transaction(async (manager) => {
        for (const entry of data.entries) {
          await manager.query('SELECT save_bank_balance($1, $2, $3, $4)', [
            entry.bankId,
            data.operationDate,
            entry.finalBalance,
            data.userId,
          ]);
        }
      });
      return data.entries.length;
    } catch (error) {
      throw this.translateBalanceError(error);
    }
  }

  /** Same `RAISE EXCEPTION '<CODE>:<bankId>'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists. */
  private translateBalanceError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const [code, bankId] = message.split(':');

    switch (code) {
      case 'BANK_NOT_FOUND':
        return new BankNotFoundError(bankId);
      case 'BANK_INACTIVE':
        return new BankInactiveError(bankId);
      case 'INVALID_OPERATION_DATE':
        return new InvalidBankBalanceDateError();
      case 'INVALID_FINAL_BALANCE':
        return new InvalidBankFinalBalanceError(bankId);
      default:
        return error;
    }
  }
}
