import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Ticket } from '../../domain/entities/ticket.entity';
import {
  CreateTicketData,
  FindTicketsOptions,
  PaginatedResult,
  TicketRepository,
} from '../../domain/repositories/ticket.repository';
import { TicketEmptyError } from '../../domain/errors/ticket-empty.error';
import { InvalidClientError } from '../../domain/errors/invalid-client.error';
import { TicketProductNotFoundError } from '../../domain/errors/ticket-product-not-found.error';
import { TicketProductInactiveError } from '../../domain/errors/ticket-product-inactive.error';
import { InvalidTicketQuantityError } from '../../domain/errors/invalid-ticket-quantity.error';
import { InvalidTicketPriceError } from '../../domain/errors/invalid-ticket-price.error';
import { TicketOrmEntity } from './ticket.orm-entity';
import { TicketMapper } from './ticket.mapper';

@Injectable()
export class TypeOrmTicketRepository implements TicketRepository {
  constructor(
    @InjectRepository(TicketOrmEntity)
    private readonly repository: Repository<TicketOrmEntity>,
  ) {}

  async createTicket(data: CreateTicketData): Promise<Ticket> {
    const itemsJson = JSON.stringify(
      data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        observation: item.observation ?? null,
        unitPrice: item.unitPrice ?? null,
      })),
    );

    let ticketId: string;
    try {
      const rows = await this.repository.manager.query<
        { create_ticket: string }[]
      >('SELECT create_ticket($1, $2, $3::jsonb, $4)', [
        data.userId,
        data.clientId,
        itemsJson,
        data.clientName,
      ]);
      ticketId = rows[0].create_ticket;
    } catch (error) {
      throw this.translateTicketError(error);
    }

    const ticket = await this.findById(ticketId);
    if (!ticket) {
      // The function just committed it — this would only happen on a bug.
      throw new InternalServerErrorException(
        'No se pudo recuperar el ticket recién creado.',
      );
    }
    return ticket;
  }

  async findAll(
    options: FindTicketsOptions,
  ): Promise<PaginatedResult<Ticket>> {
    const qb = this.repository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.client', 'client')
      .leftJoinAndSelect('ticket.user', 'user')
      .leftJoinAndSelect('ticket.voidedByUser', 'voidedByUser');

    if (options.userId) {
      qb.andWhere('ticket.userId = :userId', { userId: options.userId });
    }
    if (options.startDate) {
      qb.andWhere('ticket.createdAt >= :startDate', {
        startDate: options.startDate,
      });
    }
    if (options.endDate) {
      qb.andWhere('ticket.createdAt <= :endDate', {
        endDate: `${options.endDate} 23:59:59.999`,
      });
    }
    if (options.search) {
      qb.andWhere(
        '(ticket.clientName ILIKE :search OR client.name ILIKE :search OR ticket.ticketNumber ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }
    if (options.status === 'ACTIVE') {
      qb.andWhere('ticket.isVoided = false');
    } else if (options.status === 'VOIDED') {
      qb.andWhere('ticket.isVoided = true');
    }

    qb.orderBy('ticket.createdAt', 'DESC');
    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [orms, total] = await qb.getManyAndCount();
    return {
      // No `items` join here on purpose — the list view is a summary; see findById for the full detail.
      items: orms.map((orm) => TicketMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async findById(id: string): Promise<Ticket | null> {
    const orm = await this.repository.findOne({
      where: { id },
      relations: { items: true },
    });
    return orm ? TicketMapper.toDomain(orm) : null;
  }

  async voidTicket(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<Ticket> {
    await this.repository.update(
      { id },
      {
        isVoided: true,
        voidedAt: new Date(),
        voidedBy,
        voidReason: reason,
      },
    );
    const ticket = await this.findById(id);
    if (!ticket) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el ticket recién anulado.',
      );
    }
    return ticket;
  }

  /** Same `RAISE EXCEPTION '<CODE>:<id>'` → domain-error translation as `TypeOrmPurchaseRepository.translatePurchaseError` — see that method's own doc comment for why this parsing exists. */
  private translateTicketError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const [code, id] = message.split(':');

    switch (code) {
      case 'TICKET_EMPTY':
        return new TicketEmptyError();
      case 'CLIENT_NOT_FOUND':
        return new InvalidClientError();
      case 'PRODUCT_NOT_FOUND':
        return new TicketProductNotFoundError(id);
      case 'PRODUCT_INACTIVE':
        return new TicketProductInactiveError(id);
      case 'INVALID_QUANTITY':
        return new InvalidTicketQuantityError(id);
      case 'INVALID_UNIT_PRICE':
        return new InvalidTicketPriceError(id);
      default:
        return error;
    }
  }
}
