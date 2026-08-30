import { RechargeSalesClosure } from '../entities/recharge-sales-closure.entity';

export const RECHARGE_SALES_CLOSURE_REPOSITORY = Symbol(
  'RECHARGE_SALES_CLOSURE_REPOSITORY',
);

export interface RegisterRechargeSalesClosureData {
  date: string;
  totalCollected: number;
  userId: string;
  /** Whether re-closing an already-closed cycle is allowed — enforced inside `register_recharge_sales_closure` itself, not pre-checked here (see the migration's own comment on why). */
  isAdmin: boolean;
}

export interface RechargeSalesClosureRepository {
  /** The closure for one specific cuadre cycle of `date`, if it's already been saved. */
  findByDateAndSequence(
    date: string,
    sequence: number,
  ): Promise<RechargeSalesClosure | null>;
  /** Invokes `register_recharge_sales_closure` — recomputes total sales from real data, closes the current cycle, and (on a genuine first close) starts a fresh one. */
  registerClosure(
    data: RegisterRechargeSalesClosureData,
  ): Promise<RechargeSalesClosure>;
}
