import { TransactionContext } from '../../../../shared/application/ports/transaction-manager.port';
import { RechargeSimSaleRegistration } from '../entities/recharge-sim-sale-registration.entity';

export const RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY = Symbol(
  'RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY',
);

export interface RegisterRechargeSimSaleRegistrationData {
  rechargeSimSaleId: string;
  simNumber: string;
  sku: string;
  clientDpi: string;
  clientId: string | null;
  salePrice: number;
  dpiImageId: string | null;
  saleDate: string;
  userId: string;
}

export interface ListRechargeSimSaleRegistrationsFilters {
  startDate?: string;
  endDate?: string;
  simTypeId?: string;
  isVoided?: boolean;
  page: number;
  limit: number;
}

export interface ListRechargeSimSaleRegistrationsResult {
  items: RechargeSimSaleRegistration[];
  total: number;
  page: number;
  limit: number;
}

export interface DpiImage {
  data: Buffer;
  mimeType: string;
}

export interface RechargeSimSaleRegistrationRepository {
  /** Invokes `register_recharge_sim_sale_registration` — validates the parent sale/client server-side and inserts. Accepts a shared `TransactionContext` so this and the parent `recharge_sim_sales` insert commit/rollback together. */
  create(
    data: RegisterRechargeSimSaleRegistrationData,
    context?: TransactionContext,
  ): Promise<RechargeSimSaleRegistration>;
  findById(id: string): Promise<RechargeSimSaleRegistration | null>;
  /** Every `recharge_sim_sales` row for one calendar date, whichever "Vender SIM" flow created it — a non-voided registration's own `salePrice` overrides the row's fixed `totalAmount` (it may be a negotiated price), a voided one contributes 0, and a by-quantity sale with no registration at all counts at its own `totalAmount`. The only source `GetRechargeSalesSummaryUseCase` reads for the SIM half of Total Recaudado, so the Card and the cuadre's own "Diferencia" can never disagree. No cycle/sequence resolution needed (SIM stock has none) — scoped by `sale_date` alone. */
  getTotalByDate(date: string): Promise<number>;
  findAll(
    filters: ListRechargeSimSaleRegistrationsFilters,
  ): Promise<ListRechargeSimSaleRegistrationsResult>;
  /** Invokes `void_recharge_sim_sale_registration` — restores the parent sale's quantity onto `recharge_sim_daily_stock`, atomically. */
  voidRegistration(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<RechargeSimSaleRegistration>;
  /** Stores the raw DPI photo bytes in `recharge_sim_dpi_images`, returning its id — never exposed to the frontend directly, only referenced by `dpiImageId` on the registration insert. Accepts the same shared `TransactionContext` as `create`, so an image is never left orphaned if the registration insert that references it fails. */
  saveDpiImage(
    data: Buffer,
    mimeType: string,
    userId: string,
    context?: TransactionContext,
  ): Promise<string>;
  /** `null` if the registration has no image, or the image row is somehow missing (should never happen given the FK — defensive only). */
  getDpiImage(registrationId: string): Promise<DpiImage | null>;
}
