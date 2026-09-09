import { Ticket } from '../../domain/entities/ticket.entity';
import { TicketDetail } from '../../domain/entities/ticket-detail.entity';
import { TicketOrmEntity } from './ticket.orm-entity';

export class TicketMapper {
  /** `orm.items` is `undefined` whenever the query didn't join `ticket_details` (the list view never does) — mapped to `[]`. */
  static toDomain(orm: TicketOrmEntity): Ticket {
    return Ticket.create({
      id: orm.id,
      ticketNumber: orm.ticketNumber,
      clientId: orm.clientId,
      // Frozen at creation time by create_ticket() — never re-derived from
      // the `client` relation, so editing the Clientes catalog later never
      // changes what a historical ticket displays.
      clientName: orm.clientName,
      userId: orm.userId,
      username: orm.user.username ?? '',
      subtotal: orm.subtotal,
      discount: orm.discount,
      total: orm.total,
      isVoided: orm.isVoided,
      voidedAt: orm.voidedAt,
      voidedBy: orm.voidedBy,
      voidedByUsername: orm.voidedByUser?.username ?? null,
      voidReason: orm.voidReason,
      items: (orm.items ?? []).map((detail) =>
        TicketDetail.create({
          id: detail.id,
          productId: detail.productId,
          productName: detail.productName,
          presentationName: detail.presentationName,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          total: detail.total,
          observation: detail.observation,
        }),
      ),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
