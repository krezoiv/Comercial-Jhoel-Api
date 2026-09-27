/**
 * Curated subset of the frontend's shared icon registry — restricting to a
 * known-good list (rather than accepting any string) means a typo or a
 * since-removed icon name can never leave a type card silently blank.
 */
export const TRANSACTION_TYPE_ICONS = [
  'bank',
  'arrow-down-circle',
  'arrow-up-circle',
  'arrow-left-right',
  'credit-card',
  'wallet',
  'receipt',
  'file-check',
  'briefcase',
  'trending-up',
  'package',
  'check-circle',
  'refresh-cw',
  'shopping-bag',
] as const;

export type TransactionTypeIcon = (typeof TRANSACTION_TYPE_ICONS)[number];

/**
 * Efecto de un tipo de transacción sobre el saldo bancario — ver migración
 * `CreateBankAccountMovements`. `null` = el tipo no mueve saldo (Remesas,
 * Pago de Cheque...). DEPOSITO/DESEMBOLSO_GENESIS/REINTEGRO restan;
 * RETIRO/PAGO_GENESIS suman. Los dos de Génesis no usan selector de banco:
 * la cuenta es siempre la línea de crédito de Fundación Génesis.
 */
export const TRANSACTION_TYPE_BALANCE_EFFECTS = [
  'DEPOSITO',
  'RETIRO',
  'DESEMBOLSO_GENESIS',
  'PAGO_GENESIS',
  'REINTEGRO',
] as const;

export type TransactionTypeBalanceEffect =
  (typeof TRANSACTION_TYPE_BALANCE_EFFECTS)[number];

export interface TransactionTypeProps {
  id: string;
  name: string;
  /** Icon key from the frontend's shared icon registry — rendered on the Transaccionar dashboard's type cards. */
  icon: string;
  balanceEffect: TransactionTypeBalanceEffect | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/** "Tipo de Transacción" — the simple catalog Transaccionar's dropdown reads from. Deliberately separate from `banks` (Sistema→Bancos / Agentes Bancarios→Bancos), which is a heavier entity tied to account numbers and Cuadre de Agentes balances. */
export class TransactionType {
  private constructor(private readonly props: TransactionTypeProps) {}

  static create(props: TransactionTypeProps): TransactionType {
    return new TransactionType(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get icon(): string {
    return this.props.icon;
  }

  get balanceEffect(): TransactionTypeBalanceEffect | null {
    return this.props.balanceEffect;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdByUsername(): string {
    return this.props.createdByUsername;
  }

  get updatedBy(): string | null {
    return this.props.updatedBy;
  }

  get updatedByUsername(): string | null {
    return this.props.updatedByUsername;
  }
}
