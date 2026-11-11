import { BankDepositOperation } from '../../domain/entities/bank-deposit-operation.entity';

export interface BankDepositCashDetailOutput {
  id: string;
  denomination: number;
  quantity: number;
  subtotal: number;
}

export interface BankDepositTransactionOutput {
  id: string;
  sequence: number;
  amount: number;
}

/** Full shape — used for `GET /bank-deposits/:id` and the response of `POST /bank-deposits`. */
export interface BankDepositOperationOutput {
  id: string;
  transactionBankId: string | null;
  transactionBankName: string;
  bankAccountId: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  totalAmount: number;
  transactionCount: number;
  totalCash: number;
  totalDistributed: number;
  operationDate: string;
  /** "Vuelto" entregado al cliente — `0` cuando la operación no lo necesitó. */
  changeGiven: number;
  /** `totalCash - changeGiven` — el efectivo realmente aplicado al depósito, siempre igual a `totalAmount` en una operación guardada. */
  netCashApplied: number;
  /** `false` = registrada sin desglose de efectivo: `cashDetails` vacío y `totalCash` 0. */
  cashBreakdownEnabled: boolean;
  clientName: string | null;
  /** "Descripción / Beneficiario"; `null` on historical operations (the UI shows "Sin descripción registrada"). */
  description: string | null;
  clientId: string | null;
  transactionTypeId: string;
  transactionTypeName: string;
  userId: string;
  username: string;
  cashDetails: BankDepositCashDetailOutput[];
  transactions: BankDepositTransactionOutput[];
  createdAt: Date;
  updatedAt: Date;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  /** Solo en la respuesta de `POST /bank-deposits`: el movimiento de saldo que generó la operación (saldo anterior → posterior). */
  balanceMovement?: BankDepositBalanceMovementOutput | null;
  /** Solo en la respuesta de `POST /bank-deposits`: el movimiento del Kardex oficial de efectivo (Control de Efectivo). `currentBalance` incluye lo que la misma operación haya enviado a CxC/Activos. */
  cashMovement?: BankDepositCashMovementOutput | null;
}

export interface BankDepositCashMovementOutput {
  movementType: string;
  direction: 'IN' | 'OUT' | 'NONE';
  amount: number;
  previousBalance: number;
  newBalance: number;
  currentBalance: number;
}

export interface BankDepositBalanceMovementOutput {
  bankId: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
}

/** Lighter shape for `GET /bank-deposits`/reportería listings — no cash-detail/transaction rows. Still carries `isVoided` (and who/when/why) — the list keeps a voided operation visible with a badge, only the report's own aggregate totals exclude it (see `TypeOrmBankDepositRepository.getReportSummary`). */
export interface BankDepositOperationSummaryOutput {
  id: string;
  transactionBankId: string | null;
  transactionBankName: string;
  bankAccountId: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  totalAmount: number;
  transactionCount: number;
  operationDate: string;
  clientName: string | null;
  /** "Descripción / Beneficiario"; `null` on historical operations (the UI shows "Sin descripción registrada"). */
  description: string | null;
  clientId: string | null;
  transactionTypeId: string;
  transactionTypeName: string;
  userId: string;
  username: string;
  createdAt: Date;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export function toBankDepositOperationOutput(
  operation: BankDepositOperation,
): BankDepositOperationOutput {
  return {
    id: operation.id,
    transactionBankId: operation.transactionBankId,
    transactionBankName: operation.transactionBankName,
    bankAccountId: operation.bankAccountId,
    bankAccountName: operation.bankAccountName,
    bankAccountNumber: operation.bankAccountNumber,
    totalAmount: operation.totalAmount,
    transactionCount: operation.transactionCount,
    totalCash: operation.totalCash,
    totalDistributed: operation.totalDistributed,
    operationDate: operation.operationDate,
    changeGiven: operation.changeGiven,
    netCashApplied: operation.netCashApplied,
    cashBreakdownEnabled: operation.cashBreakdownEnabled,
    clientName: operation.clientName,
    description: operation.description,
    clientId: operation.clientId,
    transactionTypeId: operation.transactionTypeId,
    transactionTypeName: operation.transactionTypeName,
    userId: operation.userId,
    username: operation.username,
    cashDetails: operation.cashDetails.map((detail) => ({
      id: detail.id,
      denomination: detail.denomination,
      quantity: detail.quantity,
      subtotal: detail.subtotal,
    })),
    transactions: operation.transactions.map((transaction) => ({
      id: transaction.id,
      sequence: transaction.sequence,
      amount: transaction.amount,
    })),
    createdAt: operation.createdAt,
    updatedAt: operation.updatedAt,
    isVoided: operation.isVoided,
    voidedAt: operation.voidedAt,
    voidedBy: operation.voidedBy,
    voidedByUsername: operation.voidedByUsername,
    voidReason: operation.voidReason,
  };
}

export function toBankDepositOperationSummaryOutput(
  operation: BankDepositOperation,
): BankDepositOperationSummaryOutput {
  return {
    id: operation.id,
    transactionBankId: operation.transactionBankId,
    transactionBankName: operation.transactionBankName,
    bankAccountId: operation.bankAccountId,
    bankAccountName: operation.bankAccountName,
    bankAccountNumber: operation.bankAccountNumber,
    totalAmount: operation.totalAmount,
    transactionCount: operation.transactionCount,
    operationDate: operation.operationDate,
    clientName: operation.clientName,
    description: operation.description,
    clientId: operation.clientId,
    transactionTypeId: operation.transactionTypeId,
    transactionTypeName: operation.transactionTypeName,
    userId: operation.userId,
    username: operation.username,
    createdAt: operation.createdAt,
    isVoided: operation.isVoided,
    voidedAt: operation.voidedAt,
    voidedByUsername: operation.voidedByUsername,
    voidReason: operation.voidReason,
  };
}
