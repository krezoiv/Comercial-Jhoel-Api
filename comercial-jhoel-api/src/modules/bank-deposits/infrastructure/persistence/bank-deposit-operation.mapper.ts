import { BankDepositOperation } from '../../domain/entities/bank-deposit-operation.entity';
import { BankDepositCashDetail } from '../../domain/entities/bank-deposit-cash-detail.entity';
import { BankDepositTransaction } from '../../domain/entities/bank-deposit-transaction.entity';
import { BankDepositOperationOrmEntity } from './bank-deposit-operation.orm-entity';

export class BankDepositOperationMapper {
  /** `orm.cashDetails`/`orm.transactions` are `undefined` whenever the query didn't join them (the list view never does) — mapped to `[]`. */
  static toDomain(orm: BankDepositOperationOrmEntity): BankDepositOperation {
    return BankDepositOperation.create({
      id: orm.id,
      transactionBankId: orm.transactionBankId,
      transactionBankName: orm.transactionBank.name,
      totalAmount: orm.totalAmount,
      transactionCount: orm.transactionCount,
      totalCash: orm.totalCash,
      totalDistributed: orm.totalDistributed,
      operationDate: orm.operationDate,
      clientName: orm.clientName,
      transactionTypeId: orm.transactionTypeId,
      transactionTypeName: orm.transactionType.name,
      userId: orm.userId,
      username: orm.user.username ?? '',
      cashDetails: (orm.cashDetails ?? [])
        .map((detail) =>
          BankDepositCashDetail.create({
            id: detail.id,
            denomination: detail.denomination,
            quantity: detail.quantity,
            subtotal: detail.subtotal,
          }),
        )
        .sort((a, b) => b.denomination - a.denomination),
      transactions: (orm.transactions ?? [])
        .map((transaction) =>
          BankDepositTransaction.create({
            id: transaction.id,
            sequence: transaction.sequence,
            amount: transaction.amount,
          }),
        )
        .sort((a, b) => a.sequence - b.sequence),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      isVoided: orm.isVoided,
      voidedAt: orm.voidedAt,
      voidedBy: orm.voidedBy,
      voidedByUsername: orm.voidedByUser?.username ?? null,
      voidReason: orm.voidReason,
    });
  }
}
