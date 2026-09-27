/** Fixed denominations offered by the cash-breakdown table — matches the ticket's own list, quetzales only. */
export const BANK_DEPOSIT_CASH_DENOMINATIONS = [200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05] as const;

export interface BankDepositCashDetail {
  id: string;
  denomination: number;
  quantity: number;
  subtotal: number;
}

export interface BankDepositTransaction {
  id: string;
  sequence: number;
  amount: number;
}

/** Full shape returned by `POST /bank-deposits` and `GET /bank-deposits/:id`. */
export interface BankDepositOperation {
  id: string;
  /** `null` para Desembolsos/Pagos Génesis (sin banco agente). */
  transactionBankId: string | null;
  transactionBankName: string;
  /** Cuenta cuyo saldo movió la operación — `null` si el tipo no mueve saldo. */
  bankAccountId: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  totalAmount: number;
  transactionCount: number;
  totalCash: number;
  totalDistributed: number;
  operationDate: string;
  /** "Vuelto" entregado al cliente — `0` para una operación que no lo necesitó. */
  changeGiven: number;
  /** `totalCash - changeGiven` — el efectivo realmente aplicado al depósito, siempre igual a `totalAmount` en una operación guardada. */
  netCashApplied: number;
  /** Free text, typed by whoever registers the deposit — never looked up against the clients table. */
  clientName: string | null;
  /** A REGISTERED client (the same `clients` table Cuentas por Cobrar uses) — `null` unless one was linked. Independent of `clientName`; see "Enviar a cuentas por cobrar" on the Depósito form. */
  clientId: string | null;
  transactionTypeId: string;
  transactionTypeName: string;
  userId: string;
  username: string;
  cashDetails: BankDepositCashDetail[];
  transactions: BankDepositTransaction[];
  createdAt: string;
  updatedAt: string;
  /** `true` once anulada — the row is never deleted, only marked. See `voidedByUsername`/`voidReason` for who/why. */
  isVoided: boolean;
  voidedAt: string | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  /** Solo en la respuesta de `POST /bank-deposits`: saldo anterior → posterior de la cuenta afectada. */
  balanceMovement?: {
    bankId: string;
    bankName: string;
    accountNumber: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
  } | null;
}

/** Lighter shape for listings (`GET /bank-deposits`/`GET /reports/bank-deposits`) — no cash-detail/transaction rows. Still carries the void fields — a voided operation stays visible in the list (with a badge), it just doesn't count toward the report's own totals (see `ReportsService.getBankDepositsReportSummary`). */
export interface BankDepositOperationSummary {
  id: string;
  /** `null` para Desembolsos/Pagos Génesis (sin banco agente). */
  transactionBankId: string | null;
  transactionBankName: string;
  totalAmount: number;
  transactionCount: number;
  operationDate: string;
  clientName: string | null;
  clientId: string | null;
  transactionTypeId: string;
  transactionTypeName: string;
  userId: string;
  username: string;
  createdAt: string;
  isVoided: boolean;
  voidedAt: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export interface BankDepositCashDetailInput {
  denomination: number;
  quantity: number;
}

/** Payload for `POST /bank-deposits` — the backend recomputes/validates every total server-side regardless of what's sent. */
export interface RegisterBankDepositInput {
  /** Omitido para Desembolsos/Pagos Génesis. */
  transactionBankId?: string | null;
  /** Cuenta bancaria afectada (Depósito/Retiro/Reintegro). */
  bankAccountId?: string | null;
  transactionTypeId: string;
  totalAmount: number;
  cashDetails: BankDepositCashDetailInput[];
  transactionAmounts: number[];
  clientName?: string | null;
  /** A REGISTERED client id — any tipo de transacción. The backend re-validates it exists+active regardless of what was already checked client-side. */
  clientId?: string | null;
  /** "Enviar a cuentas por cobrar" — requires `clientId` and an admin account. The backend re-validates both independently — see `RegisterBankDepositOperationUseCase`. */
  sendToAccountsReceivable?: boolean;
  /** "Enviar a Activos" — solo Retiros/Desembolsos Génesis; mismas reglas que CxC y nunca junto con `sendToAccountsReceivable`. */
  sendToAssets?: boolean;
  /** "Vuelto" — omitido/`0` significa que no hubo vuelto, idéntico al comportamiento de siempre. El backend recalcula/valida esto contra el efectivo real. */
  changeGiven?: number;
}

/** `GET /bank-deposits/monthly-count` — backs the Resumen dashboard's "Bancos" tile. `count` excludes anuladas and always covers the 1st of the current month through today; it resets on its own the moment the calendar rolls into a new month, there's nothing to reset client-side. */
export interface BankDepositMonthlyCount {
  count: number;
  month: string;
}

export interface BankDepositSummaryByBank {
  transactionBankId: string;
  transactionBankName: string;
  transactions: number;
}

export interface BankDepositPeriodSummary {
  totalTransactions: number;
  byBank: BankDepositSummaryByBank[];
}

/** `GET /bank-deposits/summary` — backs Transaccionar's "Resumen Diario"/"Resumen del Mes en Curso" cards and the Resumen dashboard's "Resumen Diario de Transacciones" section, all from the same call. `daily` is today only, `monthly` is the 1st of the current calendar month through today — both server-computed (`America/Guatemala`), never derived from the browser's clock. Excludes anuladas. */
export interface BankDepositTransactionSummary {
  daily: BankDepositPeriodSummary;
  monthly: BankDepositPeriodSummary;
}

/** One entry per calendar day of the current month — a day with no non-voided operation is `transactionCount: 0`, never omitted. See `BankDepositService.getDailyStats()`. */
export interface BankDepositDailyStat {
  /** `yyyy-MM-dd` */
  date: string;
  transactionCount: number;
}

/** `GET /bank-deposits/daily-stats` — backs the "Transacciones del mes" chart shared by Resumen and Reporte de Transacciones. Always the server's current calendar month (`America/Guatemala`), never derived from the browser's clock; excludes anuladas. Both screens read this exact same call so they can never disagree. */
export interface BankDepositDailyStats {
  /** `yyyy-MM` */
  month: string;
  days: BankDepositDailyStat[];
}

/** One 7-day bucket of the current month, día 1 en adelante (nunca semana ISO) — ver `BankDepositService.getWeeklyStats()`. */
export interface BankDepositWeeklyStat {
  weekNumber: number;
  /** "Semana N" */
  label: string;
  /** `yyyy-MM-dd` */
  startDate: string;
  /** `yyyy-MM-dd` */
  endDate: string;
  transactionCount: number;
}

/** `GET /bank-deposits/weekly-stats` — backs "Transacciones por semana" en Gráficas → Indicadores de Transacciones. Siempre el mes actual del servidor, se reinicia solo cada mes (por filtro de fecha, nunca borrando historial). */
export interface BankDepositWeeklyStats {
  /** `yyyy-MM` */
  month: string;
  weeks: BankDepositWeeklyStat[];
}

/** Un mes del año actual — permanece en la lista aunque tenga 0 transacciones, nunca se oculta. Ver `BankDepositService.getYearlyStats()`. */
export interface BankDepositMonthlyStat {
  /** `yyyy-MM` */
  month: string;
  /** Nombre del mes en español, ej. "Septiembre". */
  label: string;
  transactionCount: number;
}

/** `GET /bank-deposits/yearly-stats` — backs "Transacciones por mes" en Gráficas → Indicadores de Transacciones. Enero hasta el mes actual, acumulativo — nunca se reinicia dentro del año. */
export interface BankDepositYearlyStats {
  year: number;
  months: BankDepositMonthlyStat[];
}

export interface BankDepositsReportFilters {
  startDate?: string;
  endDate?: string;
  transactionBankId?: string;
  transactionTypeId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface BankDepositsReportByBank {
  transactionBankId: string;
  transactionBankName: string;
  operationCount: number;
  totalAmount: number;
}

export interface BankDepositsReportSummary {
  operationCount: number;
  transactionCount: number;
  totalAmount: number;
  byBank: BankDepositsReportByBank[];
}
