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
