import {
  AccountReceivable,
  AccountReceivableMovementType,
} from '../../domain/entities/account-receivable.entity';

export interface AccountReceivableOutput {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  movementType: AccountReceivableMovementType;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export function toAccountReceivableOutput(
  record: AccountReceivable,
): AccountReceivableOutput {
  return {
    id: record.id,
    clientId: record.clientId,
    clientName: record.clientName,
    date: record.date,
    amount: record.amount,
    movementType: record.movementType,
    description: record.description,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    createdBy: record.createdBy,
    createdByUsername: record.createdByUsername,
    updatedBy: record.updatedBy,
    updatedByUsername: record.updatedByUsername,
  };
}
