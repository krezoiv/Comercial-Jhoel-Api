export interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  accountTypeId: string;
  accountTypeName: string;
  /** Cached "current" figures, not a specific operation date's values — see the backend's `BankProps` doc comment. For a given date's actual previous/final balance, use `BankBalanceView` instead. */
  previousBalance: number;
  /** SALDO ACTUAL dinámico — solo lo mueven Transaccionar, las transferencias y los ajustes manuales (backend). Puede ser negativo únicamente para la línea de crédito de Génesis ("saldo a favor"). */
  finalBalance: number;
  specialAccount: BankSpecialAccount | null;
  /** Límite máximo configurable del saldo (BI Club / Génesis) — `null` = sin límite. */
  maxBalance: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Payload for create/update — the backend assigns id/isActive/timestamps. */
export interface BankInput {
  name: string;
  accountNumber: string;
  accountTypeId: string;
  previousBalance?: number;
  /** Solo en el alta (saldo inicial). En edición el backend rechaza un cambio: se corrige con "Ajustar saldo". */
  finalBalance?: number;
  specialAccount?: BankSpecialAccount | null;
  maxBalance?: number | null;
}

/** Reglas especiales de saldo — espejo de `BANK_SPECIAL_ACCOUNTS` del backend (`banks.special_account`). */
export type BankSpecialAccount = 'GENESIS' | 'BI_CLUB' | 'DISTRICOL' | 'BANCO_INDUSTRIAL' | 'BANCO_AGROMERCANTIL';

export const BANK_SPECIAL_ACCOUNT_OPTIONS: { value: BankSpecialAccount; label: string; hint: string }[] = [
  {
    value: 'GENESIS',
    label: 'Fundación Génesis — línea de crédito',
    hint: 'Desembolsos/Pagos Génesis la usan automáticamente; puede quedar en negativo (saldo a favor).',
  },
  { value: 'BI_CLUB', label: 'BI Club Empresarial', hint: 'Solo recibe transferencias de Banco Industrial; admite límite máximo.' },
  { value: 'DISTRICOL', label: 'Districol', hint: 'Solo recibe transferencias de Banco Agromercantil.' },
  { value: 'BANCO_INDUSTRIAL', label: 'Banco Industrial', hint: 'Puede transferir a BI Club Empresarial.' },
  { value: 'BANCO_AGROMERCANTIL', label: 'Banco Agromercantil', hint: 'Puede transferir a Districol.' },
];

/** "Banco · Tipo · No. cuenta" — la etiqueta única de una cuenta en selectores (un mismo banco puede tener varias cuentas). */
export function bankAccountLabel(bank: { name: string; accountTypeName: string; accountNumber: string }): string {
  return `${bank.name} · ${bank.accountTypeName} · ${bank.accountNumber}`;
}

export { formatCurrency as formatBankCurrency } from '../utils/number-format.util';
