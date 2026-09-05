import { Sale } from '../../domain/entities/sale.entity';
import { SaleDetail } from '../../domain/entities/sale-detail.entity';
import { SaleOrmEntity } from './sale.orm-entity';

export class SaleMapper {
  /** `orm.items` is `undefined` whenever the query didn't join `sale_details` (the list view never does) — mapped to `[]`. */
  static toDomain(orm: SaleOrmEntity): Sale {
    return Sale.create({
      id: orm.id,
      userId: orm.userId,
      username: orm.user.username ?? '',
      saleDate: orm.saleDate,
      total: orm.total,
      status: orm.status,
      clientId: orm.clientId,
      clientName: orm.client?.name ?? null,
      priceList: orm.priceList,
      draftKey: orm.draftKey,
      items: (orm.items ?? []).map((detail) =>
        SaleDetail.create({
          id: detail.id,
          productId: detail.productId,
          productName: detail.product.name,
          sku: detail.product.sku,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          total: detail.total,
        }),
      ),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
