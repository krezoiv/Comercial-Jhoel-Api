import { Bank, BankSpecialAccount, TransactionBank, TransactionTypeBalanceEffect } from '../models';

/**
 * Mapeo ÚNICO "Banco Agente (icono) → cuenta afectada" de Transaccionar
 * (Depósito, Retiro y Reintegro). Lo usan el modal de selección de banco y
 * el encabezado del formulario — ninguna otra parte del módulo debe repetir
 * estas reglas.
 *
 * La cuenta se identifica primero por `specialAccount` (identificador estable
 * del backend) y solo cuando la cuenta no tiene uno, por su nombre exacto
 * normalizado (sin acentos/mayúsculas/puntuación — nunca "contiene"). Un
 * banco sin regla o sin cuenta correspondiente NUNCA cae en otra cuenta: se
 * reporta y no se deja continuar. El backend sigue validando la cuenta
 * (`available_in_transaccionar`, Reintegro ≠ Génesis, saldos) al guardar.
 */
export interface TransactionBankAccountRule {
  key: string;
  /** Sigla que se pinta en el icono del banco. */
  monogram: string;
  /** Nombres aceptados del Banco Agente (catálogo `transaction_banks`), ya normalizados. */
  agentNames: string[];
  /** Cuenta esperada — por cuenta especial, o por nombre exacto normalizado. */
  account: { specialAccount: BankSpecialAccount } | { names: string[] };
  /** Nombre de la cuenta esperada, para mensajes. */
  accountName: string;
}

export const TRANSACTION_BANK_ACCOUNT_RULES: readonly TransactionBankAccountRule[] = [
  {
    key: 'AKISI',
    monogram: 'AK',
    agentNames: ['akisi'],
    account: { specialAccount: 'GENESIS' },
    accountName: 'Fundación Génesis Empresarial',
  },
  {
    key: 'BAC',
    monogram: 'BAC',
    agentNames: ['bac', 'banco de america central', 'banco america central'],
    account: { names: ['banco de america central', 'banco america central'] },
    accountName: 'Banco de América Central',
  },
  {
    key: 'BANTRAB',
    monogram: 'BT',
    agentNames: ['bantrab', 'banco de los trabajadores'],
    // "Trabajadoes" = la cuenta tal como está registrada hoy en Sistema → Bancos.
    account: { names: ['banco de los trabajadores', 'banco de los trabajadoes', 'bantrab'] },
    accountName: 'Banco de los Trabajadores',
  },
  {
    key: 'BAM',
    monogram: 'BAM',
    agentNames: ['bam', 'districol bam', 'bam districol', 'districol'],
    account: { specialAccount: 'DISTRICOL' },
    accountName: 'Districol',
  },
  {
    key: 'GTC',
    monogram: 'GTC',
    agentNames: ['gtc'],
    account: { names: ['gtc'] },
    accountName: 'GTC',
  },
  {
    key: 'BANCO_INDUSTRIAL',
    monogram: 'BI',
    agentNames: ['industrial', 'banco industrial', 'bi'],
    account: { specialAccount: 'BANCO_INDUSTRIAL' },
    accountName: 'Banco Industrial',
  },
  {
    key: 'BANCO_AZTECA',
    monogram: 'AZ',
    agentNames: ['azteca', 'banco azteca'],
    account: { names: ['banco azteca', 'azteca'] },
    accountName: 'Banco Azteca',
  },
];

/** Sin acentos, minúsculas, cualquier puntuación/guion colapsado a un espacio: "Districol - BAM" → "districol bam". */
export function normalizeBankName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function findTransactionBankRule(agent: Pick<TransactionBank, 'name'>): TransactionBankAccountRule | null {
  const name = normalizeBankName(agent.name);
  return TRANSACTION_BANK_ACCOUNT_RULES.find((rule) => rule.agentNames.includes(name)) ?? null;
}

function accountMatchesRule(account: Bank, rule: TransactionBankAccountRule): boolean {
  if ('specialAccount' in rule.account) {
    return account.specialAccount === rule.account.specialAccount;
  }
  return rule.account.names.includes(normalizeBankName(account.name));
}

export type TransactionBankResolution =
  | { status: 'ok'; rule: TransactionBankAccountRule; accounts: Bank[] }
  | { status: 'unmapped' | 'missing' | 'unavailable' | 'not-allowed'; rule: TransactionBankAccountRule | null; message: string };

/**
 * Resuelve la(s) cuenta(s) que afectará el banco elegido. `accounts` con más
 * de un elemento (p. ej. varias cuentas GTC) obliga a elegir cuál dentro del
 * propio modal — nunca se toma la primera por defecto.
 */
export function resolveTransactionBankAccount(
  agent: Pick<TransactionBank, 'name'>,
  bankAccounts: Bank[],
  effect: TransactionTypeBalanceEffect | null,
): TransactionBankResolution {
  const rule = findTransactionBankRule(agent);
  if (!rule) {
    return { status: 'unmapped', rule: null, message: `${agent.name} no tiene una cuenta asignada para esta operación.` };
  }

  const candidates = bankAccounts.filter((account) => account.isActive && accountMatchesRule(account, rule));
  if (candidates.length === 0) {
    return {
      status: 'missing',
      rule,
      message: `No se encontró la cuenta ${rule.accountName} en Sistema → Bancos.`,
    };
  }

  const enabled = candidates.filter((account) => account.availableInTransaccionar);
  if (enabled.length === 0) {
    return {
      status: 'unavailable',
      rule,
      message: `La cuenta ${rule.accountName} no está habilitada «En Transaccionar» (Sistema → Bancos).`,
    };
  }

  // Misma regla del backend (`REINTEGRO_SOURCE_IS_GENESIS`): la línea Génesis no puede ser el origen de un reintegro.
  const allowed = effect === 'REINTEGRO' ? enabled.filter((account) => account.specialAccount !== 'GENESIS') : enabled;
  if (allowed.length === 0) {
    return {
      status: 'not-allowed',
      rule,
      message: `${rule.accountName} no puede ser la cuenta origen de un reintegro.`,
    };
  }

  return { status: 'ok', rule, accounts: allowed };
}

/** Sigla del icono — la de la regla, o las iniciales del banco si no tiene regla. */
export function transactionBankMonogram(agent: Pick<TransactionBank, 'name'>): string {
  const rule = findTransactionBankRule(agent);
  if (rule) {
    return rule.monogram;
  }
  const words = normalizeBankName(agent.name).split(' ').filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}
