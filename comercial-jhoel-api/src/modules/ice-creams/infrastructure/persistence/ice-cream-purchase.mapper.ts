import { IceCreamPurchase } from '../../domain/entities/ice-cream-purchase.entity';
import { IceCreamPurchaseDetail } from '../../domain/entities/ice-cream-purchase-detail.entity';
import { IceCreamPurchaseOrmEntity } from './ice-cream-purchase.orm-entity';

export class IceCreamPurchaseMapper {
  /** `orm.items` is `undefined` whenever the query didn't join `ice_cream_purchase_details` (the list view never does) — mapped to `[]`. */
  static toDomain(orm: IceCreamPurchaseOrmEntity): IceCreamPurchase {
    return IceCreamPurchase.create({
      id: orm.id,
      supplierId: orm.supplierId,
      supplierName: orm.supplier.name,
      userId: orm.userId,
      username: orm.user.username ?? '',
      purchaseDate: orm.purchaseDate,
      total: orm.total,
      items: (orm.items ?? []).map((detail) =>
        IceCreamPurchaseDetail.create({
          id: detail.id,
          iceCreamId: detail.iceCreamId,
          product: detail.iceCream.product,
          sku: detail.iceCream.sku,
          quantity: detail.quantity,
          costPrice: detail.costPrice,
          total: detail.subtotal,
        }),
      ),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
