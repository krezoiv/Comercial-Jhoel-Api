import type { ChargePaymentStatus } from '../../domain/repositories/account-receivable-settlement.repository';
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
  referenceType: string | null;
  referenceId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
  /**
   * Collection state of an active CARGO (computed in PostgreSQL by
   * `ar_charge_balances`); only filled by the list — `null` for ABONOs,
   * deactivated rows and single-record reads.
   */
  pendingAmount?: number | null;
  paidAmount?: number | null;
  paymentStatus?: ChargePaymentStatus | null;
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
    referenceType: record.referenceType,
    referenceId: record.referenceId,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    createdBy: record.createdBy,
    createdByUsername: record.createdByUsername,
    updatedBy: record.updatedBy,
    updatedByUsername: record.updatedByUsername,
  };
}
