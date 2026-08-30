import { IceCreamSale } from '../../domain/entities/ice-cream-sale.entity';
import { IceCreamSaleDetail } from '../../domain/entities/ice-cream-sale-detail.entity';
import { IceCreamSaleOrmEntity } from './ice-cream-sale.orm-entity';

export class IceCreamSaleMapper {
  /** `orm.items` is `undefined` whenever the query didn't join `ice_cream_sale_details` (the list view never does) — mapped to `[]`. */
  static toDomain(orm: IceCreamSaleOrmEntity): IceCreamSale {
    return IceCreamSale.create({
      id: orm.id,
      userId: orm.userId,
      username: orm.user.username ?? '',
      saleDate: orm.saleDate,
      total: orm.total,
      items: (orm.items ?? []).map((detail) =>
        IceCreamSaleDetail.create({
          id: detail.id,
          iceCreamId: detail.iceCreamId,
          product: detail.iceCream.product,
          sku: detail.iceCream.sku,
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
