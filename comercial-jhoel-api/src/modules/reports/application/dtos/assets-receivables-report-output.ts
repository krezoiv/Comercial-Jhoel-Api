export type AssetsReceivablesReportType = 'assets' | 'accounts_receivable';

export interface AssetsReceivablesReportRowOutput {
  id: string;
  type: AssetsReceivablesReportType;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  description: string | null;
  isActive: boolean;
}

export interface AssetsReceivablesReportSummaryOutput {
  totalAssets: number;
  totalAccountsReceivable: number;
  totalGeneral: number;
  recordCount: number;
}
