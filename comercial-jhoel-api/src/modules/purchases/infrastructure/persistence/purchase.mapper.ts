import { Purchase } from '../../domain/entities/purchase.entity';
import { PurchaseDetail } from '../../domain/entities/purchase-detail.entity';
import { PurchaseOrmEntity } from './purchase.orm-entity';

export class PurchaseMapper {
  /** `orm.items` is `undefined` whenever the query didn't join `purchase_details` (the list view never does) — mapped to `[]`. */
  static toDomain(orm: PurchaseOrmEntity): Purchase {
    return Purchase.create({
      id: orm.id,
      supplierId: orm.supplierId,
      supplierName: orm.supplier.name,
      userId: orm.userId,
      username: orm.user.username ?? '',
      purchaseDate: orm.purchaseDate,
      total: orm.total,
      items: (orm.items ?? []).map((detail) =>
        PurchaseDetail.create({
          id: detail.id,
          productId: detail.productId,
          productName: detail.product.name,
          sku: detail.product.sku,
          quantity: detail.quantity,
          costPrice: detail.costPrice,
          publicPrice: detail.publicPrice,
          total: detail.total,
        }),
      ),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
