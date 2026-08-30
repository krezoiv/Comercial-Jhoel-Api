export interface AgentReconciliationProps {
  id: string;
  date: string;
  totalCash: number;
  totalBanks: number;
  totalAssets: number;
  totalAccountsReceivable: number;
  result: number;
  createdAt: Date;
  createdBy: string;
  createdByUsername: string;
}

/**
 * A frozen historical snapshot of one "Cuadre Agentes" close — segunda
 * etapa. `totalBanks`/`totalAssets`/`totalAccountsReceivable` are copied
 * in at save time from `GetCuadreAgentesSummaryUseCase` (never recomputed
 * live from this row later), same "frozen snapshot, not a live view"
 * reasoning `recharge_sales_closures` already established for its own
 * `total_sales`/`total_collected`. Only `totalCash` genuinely originates
 * from the caller — see `CloseAgentDayUseCase`.
 */
export class AgentReconciliation {
  private constructor(private readonly props: AgentReconciliationProps) {}

  static create(props: AgentReconciliationProps): AgentReconciliation {
    return new AgentReconciliation(props);
  }

  get id(): string {
    return this.props.id;
  }

  get date(): string {
    return this.props.date;
  }

  get totalCash(): number {
    return this.props.totalCash;
  }

  get totalBanks(): number {
    return this.props.totalBanks;
  }

  get totalAssets(): number {
    return this.props.totalAssets;
  }

  get totalAccountsReceivable(): number {
    return this.props.totalAccountsReceivable;
  }

  get result(): number {
    return this.props.result;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdByUsername(): string {
    return this.props.createdByUsername;
  }
}
