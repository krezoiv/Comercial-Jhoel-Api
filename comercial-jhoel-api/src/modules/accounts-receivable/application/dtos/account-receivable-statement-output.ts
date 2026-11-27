import type {
  PortfolioStatement,
  PortfolioStatementMovement,
} from '../../../../shared/domain/portfolio-record';
import { AccountReceivableStatement } from '../../domain/repositories/account-receivable.repository';

/** A statement row with its cash trace; voided rows keep their place (balanceAfter null). */
export type StatementMovementOutput = PortfolioStatementMovement;

export type AccountReceivableStatementOutput = PortfolioStatement;

export function toAccountReceivableStatementOutput(
  statement: AccountReceivableStatement,
): AccountReceivableStatementOutput {
  return {
    clientId: statement.clientId,
    clientName: statement.clientName,
    openingBalance: statement.openingBalance,
    movements: statement.movements.map((movement) => ({ ...movement })),
    totalCargos: statement.totalCargos,
    totalAbonos: statement.totalAbonos,
    closingBalance: statement.closingBalance,
    voidedCount: statement.voidedCount,
  };
}
