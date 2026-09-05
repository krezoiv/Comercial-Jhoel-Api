export type AssetsReceivablesReportType = 'assets' | 'accounts_receivable';

export interface AssetsReceivablesReportRowOutput {
  id: string;
  type: AssetsReceivablesReportType;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  /** `amount` is always a positive magnitude now (see migration `CreateFinancialKardexColumns`) — this is what lets the report distinguish a Cargo from an Abono, information a bare negative `amount` used to carry for Activos before that migration. */
  movementType: 'CARGO' | 'ABONO';
  description: string | null;
  isActive: boolean;
}

export interface AssetsReceivablesReportSummaryOutput {
  totalAssets: number;
  totalAccountsReceivable: number;
  totalGeneral: number;
  recordCount: number;
}
