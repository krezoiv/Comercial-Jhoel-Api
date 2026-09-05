import { Asset, AssetMovementType } from '../../domain/entities/asset.entity';

export interface AssetOutput {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  movementType: AssetMovementType;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export function toAssetOutput(asset: Asset): AssetOutput {
  return {
    id: asset.id,
    clientId: asset.clientId,
    clientName: asset.clientName,
    date: asset.date,
    amount: asset.amount,
    movementType: asset.movementType,
    description: asset.description,
    isActive: asset.isActive,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
    createdBy: asset.createdBy,
    createdByUsername: asset.createdByUsername,
    updatedBy: asset.updatedBy,
    updatedByUsername: asset.updatedByUsername,
  };
}
