import { IceCream } from '../../domain/entities/ice-cream.entity';

/** Plain, serializable shape use cases return — never the domain entity itself. */
export interface IceCreamOutput {
  id: string;
  sku: string;
  product: string;
  costPrice: number;
  publicPrice: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export function toIceCreamOutput(iceCream: IceCream): IceCreamOutput {
  return {
    id: iceCream.id,
    sku: iceCream.sku,
    product: iceCream.product,
    costPrice: iceCream.costPrice,
    publicPrice: iceCream.publicPrice,
    stock: iceCream.stock,
    isActive: iceCream.isActive,
    createdAt: iceCream.createdAt,
    updatedAt: iceCream.updatedAt,
    createdBy: iceCream.createdBy,
    createdByUsername: iceCream.createdByUsername,
    updatedBy: iceCream.updatedBy,
    updatedByUsername: iceCream.updatedByUsername,
  };
}
