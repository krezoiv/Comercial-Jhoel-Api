import type {
  PortfolioStatement,
  PortfolioStatementMovement,
} from '../../../../shared/domain/portfolio-record';
import { AssetStatement } from '../../domain/repositories/asset.repository';

/** A statement row with its cash trace; voided rows keep their place (balanceAfter null). */
export type StatementMovementOutput = PortfolioStatementMovement;

export type AssetStatementOutput = PortfolioStatement;

export function toAssetStatementOutput(
  statement: AssetStatement,
): AssetStatementOutput {
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
