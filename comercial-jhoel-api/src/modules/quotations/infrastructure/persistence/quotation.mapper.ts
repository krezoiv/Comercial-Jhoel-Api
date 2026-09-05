import { Quotation } from '../../domain/entities/quotation.entity';
import { QuotationDetail } from '../../domain/entities/quotation-detail.entity';
import { QuotationOrmEntity } from './quotation.orm-entity';

export class QuotationMapper {
  /** `orm.items` is `undefined` whenever the query didn't join `quotation_details` (the list view never does) — mapped to `[]`. */
  static toDomain(orm: QuotationOrmEntity): Quotation {
    return Quotation.create({
      id: orm.id,
      quotationNumber: orm.quotationNumber,
      clientId: orm.clientId,
      clientName: orm.client.name,
      userId: orm.userId,
      username: orm.user.username ?? '',
      quotationDate: orm.quotationDate,
      expirationDate: orm.expirationDate,
      subtotal: orm.subtotal,
      discount: orm.discount,
      total: orm.total,
      observations: orm.observations,
      commercialTerms: orm.commercialTerms,
      status: orm.status,
      voidedAt: orm.voidedAt,
      voidedBy: orm.voidedBy,
      voidedByUsername: orm.voidedByUser?.username ?? null,
      voidReason: orm.voidReason,
      convertedToSaleId: orm.convertedToSaleId,
      items: (orm.items ?? []).map((detail) =>
        QuotationDetail.create({
          id: detail.id,
          productId: detail.productId,
          productName: detail.productName,
          presentationName: detail.presentationName,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          discount: detail.discount,
          subtotal: detail.subtotal,
          total: detail.total,
        }),
      ),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
