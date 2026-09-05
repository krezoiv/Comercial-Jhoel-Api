import { BankDepositCashDetail } from './bank-deposit-cash-detail.entity';
import { BankDepositTransaction } from './bank-deposit-transaction.entity';

export interface BankDepositOperationProps {
  id: string;
  transactionBankId: string;
  transactionBankName: string;
  totalAmount: number;
  transactionCount: number;
  totalCash: number;
  totalDistributed: number;
  operationDate: string;
  clientName: string | null;
  transactionTypeId: string;
  transactionTypeName: string;
  userId: string;
  username: string;
  cashDetails: BankDepositCashDetail[];
  transactions: BankDepositTransaction[];
  createdAt: Date;
  updatedAt: Date;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

/**
 * A registered "Transaccionar" deposit — `totalCash`/`totalDistributed` are server-recalculated
 * totals cached on the row by `register_bank_deposit_operation()`, always equal to `totalAmount`
 * by construction (the function rolls back the whole operation otherwise, see the "cuadre" rule
 * in the module's plan) — never trust a caller-supplied total for either.
 */
export class BankDepositOperation {
  private constructor(private readonly props: BankDepositOperationProps) {}

  static create(props: BankDepositOperationProps): BankDepositOperation {
    return new BankDepositOperation(props);
  }

  get id(): string {
    return this.props.id;
  }

  get transactionBankId(): string {
    return this.props.transactionBankId;
  }

  get transactionBankName(): string {
    return this.props.transactionBankName;
  }

  get totalAmount(): number {
    return this.props.totalAmount;
  }

  get transactionCount(): number {
    return this.props.transactionCount;
  }

  get totalCash(): number {
    return this.props.totalCash;
  }

  get totalDistributed(): number {
    return this.props.totalDistributed;
  }

  get operationDate(): string {
    return this.props.operationDate;
  }

  get clientName(): string | null {
    return this.props.clientName;
  }

  get transactionTypeId(): string {
    return this.props.transactionTypeId;
  }

  get transactionTypeName(): string {
    return this.props.transactionTypeName;
  }

  get userId(): string {
    return this.props.userId;
  }

  get username(): string {
    return this.props.username;
  }

  get cashDetails(): BankDepositCashDetail[] {
    return this.props.cashDetails;
  }

  get transactions(): BankDepositTransaction[] {
    return this.props.transactions;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get isVoided(): boolean {
    return this.props.isVoided;
  }

  get voidedAt(): Date | null {
    return this.props.voidedAt;
  }

  get voidedBy(): string | null {
    return this.props.voidedBy;
  }

  get voidedByUsername(): string | null {
    return this.props.voidedByUsername;
  }

  get voidReason(): string | null {
    return this.props.voidReason;
  }
}
