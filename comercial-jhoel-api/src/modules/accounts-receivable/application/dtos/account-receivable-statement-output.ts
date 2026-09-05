import { AccountReceivableMovementType } from '../../domain/entities/account-receivable.entity';
import {
  AccountReceivableStatement,
  StatementMovement,
} from '../../domain/repositories/account-receivable.repository';

export interface StatementMovementOutput {
  id: string;
  date: string;
  movementType: AccountReceivableMovementType;
  description: string | null;
  amount: number;
  balanceAfter: number;
  createdByUsername: string;
  createdAt: Date;
}

export interface AccountReceivableStatementOutput {
  clientId: string;
  clientName: string;
  openingBalance: number;
  movements: StatementMovementOutput[];
  totalCargos: number;
  totalAbonos: number;
  closingBalance: number;
}

function toStatementMovementOutput(
  movement: StatementMovement,
): StatementMovementOutput {
  return {
    id: movement.id,
    date: movement.date,
    movementType: movement.movementType,
    description: movement.description,
    amount: movement.amount,
    balanceAfter: movement.balanceAfter,
    createdByUsername: movement.createdByUsername,
    createdAt: movement.createdAt,
  };
}

export function toAccountReceivableStatementOutput(
  statement: AccountReceivableStatement,
): AccountReceivableStatementOutput {
  return {
    clientId: statement.clientId,
    clientName: statement.clientName,
    openingBalance: statement.openingBalance,
    movements: statement.movements.map(toStatementMovementOutput),
    totalCargos: statement.totalCargos,
    totalAbonos: statement.totalAbonos,
    closingBalance: statement.closingBalance,
  };
}
