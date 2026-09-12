import { RechargeSimSaleRegistration } from '../../domain/entities/recharge-sim-sale-registration.entity';

export interface RechargeSimSaleRegistrationOutput {
  id: string;
  rechargeSimSaleId: string;
  simTypeId: string;
  simTypeName: string;
  simNumber: string;
  sku: string;
  clientDpi: string;
  clientId: string | null;
  clientName: string | null;
  salePrice: number;
  saleDate: string;
  hasDpiImage: boolean;
  isVoided: boolean;
  voidedAt: string | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: string;
}

export function toRechargeSimSaleRegistrationOutput(
  registration: RechargeSimSaleRegistration,
): RechargeSimSaleRegistrationOutput {
  return {
    id: registration.id,
    rechargeSimSaleId: registration.rechargeSimSaleId,
    simTypeId: registration.simTypeId,
    simTypeName: registration.simTypeName,
    simNumber: registration.simNumber,
    sku: registration.sku,
    clientDpi: registration.clientDpi,
    clientId: registration.clientId,
    clientName: registration.clientName,
    salePrice: registration.salePrice,
    saleDate: registration.saleDate,
    hasDpiImage: registration.hasDpiImage,
    isVoided: registration.isVoided,
    voidedAt: registration.voidedAt ? registration.voidedAt.toISOString() : null,
    voidedBy: registration.voidedBy,
    voidedByUsername: registration.voidedByUsername,
    voidReason: registration.voidReason,
    createdBy: registration.createdBy,
    createdByUsername: registration.createdByUsername,
    createdAt: registration.createdAt.toISOString(),
  };
}

export interface PaginatedRechargeSimSaleRegistrationsOutput {
  items: RechargeSimSaleRegistrationOutput[];
  total: number;
  page: number;
  limit: number;
}
