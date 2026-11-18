import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Quotation } from '../../domain/entities/quotation.entity';
import {
  CreateQuotationData,
  FindQuotationsOptions,
  PaginatedResult,
  QuotationRepository,
  QuotationSalePreviewLine,
  QuotationStatusAction,
} from '../../domain/repositories/quotation.repository';
import { quotationRuleErrorFromMessage } from '../../domain/errors/quotation-rule.error';
import { QuotationEmptyError } from '../../domain/errors/quotation-empty.error';
import { InvalidClientError } from '../../domain/errors/invalid-client.error';
import { QuotationProductNotFoundError } from '../../domain/errors/quotation-product-not-found.error';
import { QuotationProductInactiveError } from '../../domain/errors/quotation-product-inactive.error';
import { InvalidQuotationQuantityError } from '../../domain/errors/invalid-quotation-quantity.error';
import { InvalidQuotationDiscountError } from '../../domain/errors/invalid-quotation-discount.error';
import { InvalidExpirationDateError } from '../../domain/errors/invalid-expiration-date.error';
import { QuotationOrmEntity } from './quotation.orm-entity';
import { QuotationMapper } from './quotation.mapper';
import { todayIsoDate } from '../../application/utils/today-iso-date';

@Injectable()
export class TypeOrmQuotationRepository implements QuotationRepository {
  constructor(
    @InjectRepository(QuotationOrmEntity)
    private readonly repository: Repository<QuotationOrmEntity>,
  ) {}

  async createQuotation(data: CreateQuotationData): Promise<Quotation> {
    const itemsJson = JSON.stringify(
      data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        discount: item.discount,
      })),
    );
    const customerJson = data.customer ? JSON.stringify(data.customer) : null;

    let quotationId: string;
    try {
      const rows = await this.repository.manager.query<
        { create_quotation: string }[]
      >(
        'SELECT create_quotation($1, $2, $3::jsonb, $4, $5::jsonb, $6, $7, $8)',
        [
          data.userId,
          data.clientId,
          customerJson,
          data.expirationDate,
          itemsJson,
          data.observations,
          data.commercialTerms,
          data.asDraft,
        ],
      );
      quotationId = rows[0].create_quotation;
    } catch (error) {
      throw this.translateQuotationError(error);
    }

    const quotation = await this.findById(quotationId);
    if (!quotation) {
      // The function just committed it — this would only happen on a bug.
      throw new InternalServerErrorException(
        'No se pudo recuperar la cotización recién creada.',
      );
    }
    return quotation;
  }

  async findAll(
    options: FindQuotationsOptions,
  ): Promise<PaginatedResult<Quotation>> {
    const qb = this.repository
      .createQueryBuilder('quotation')
      .leftJoinAndSelect('quotation.client', 'client')
      .leftJoinAndSelect('quotation.user', 'user')
      .leftJoinAndSelect('quotation.voidedByUser', 'voidedByUser');

    if (options.userId) {
      qb.andWhere('quotation.userId = :userId', { userId: options.userId });
    }
    if (options.startDate) {
      qb.andWhere('quotation.createdAt >= :startDate', {
        startDate: options.startDate,
      });
    }
    if (options.endDate) {
      qb.andWhere('quotation.createdAt <= :endDate', {
        endDate: `${options.endDate} 23:59:59.999`,
      });
    }
    if (options.search) {
      qb.andWhere(
        "(search_normalize(COALESCE(quotation.customerName, client.name)) LIKE search_normalize(:search) OR search_normalize(quotation.quotationNumber) LIKE search_normalize(:search) OR quotation.customerPhone LIKE :search OR search_normalize(COALESCE(quotation.studentName, '')) LIKE search_normalize(:search))",
        { search: `%${options.search}%` },
      );
    }

    // 'VENCIDA' is never a stored status — it means "still PENDIENTE, but
    // past its expiration date". Filtering by 'PENDIENTE' conversely
    // excludes those (they're VENCIDA now), so the two filters partition
    // what would otherwise be one ambiguous stored value. See
    // `QuotationStatusFilter`'s own doc comment.
    const today = todayIsoDate();
    if (options.status === 'VENCIDA') {
      qb.andWhere('quotation.status = :status', { status: 'COTIZADA' });
      qb.andWhere('quotation.expirationDate < :today', { today });
    } else if (options.status === 'COTIZADA') {
      qb.andWhere('quotation.status = :status', { status: 'COTIZADA' });
      qb.andWhere('quotation.expirationDate >= :today', { today });
    } else if (options.status) {
      qb.andWhere('quotation.status = :status', { status: options.status });
    }

    qb.orderBy('quotation.createdAt', 'DESC');
    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [orms, total] = await qb.getManyAndCount();
    return {
      // No `items` join here on purpose — the list view is a summary; see findById for the full detail.
      items: orms.map((orm) => QuotationMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async findById(id: string): Promise<Quotation | null> {
    const orm = await this.repository.findOne({
      where: { id },
      relations: { items: true },
    });
    return orm ? QuotationMapper.toDomain(orm) : null;
  }

  async changeStatus(
    id: string,
    action: QuotationStatusAction,
    userId: string,
    reason: string | null,
  ): Promise<Quotation> {
    try {
      await this.repository.manager.query(
        'SELECT change_quotation_status($1, $2, $3, $4)',
        [id, action, userId, reason],
      );
    } catch (error) {
      throw this.translateQuotationError(error);
    }
    const quotation = await this.findById(id);
    if (!quotation) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la cotización.',
      );
    }
    return quotation;
  }

  async convertToSale(id: string, userId: string): Promise<string> {
    try {
      const rows = await this.repository.manager.query<{ sale_id: string }[]>(
        'SELECT convert_quotation_to_sale($1, $2) AS sale_id',
        [id, userId],
      );
      return rows[0].sale_id;
    } catch (error) {
      throw this.translateQuotationError(error);
    }
  }

  async salePreview(id: string): Promise<QuotationSalePreviewLine[]> {
    const rows = await this.repository.manager.query<Record<string, unknown>[]>(
      `SELECT d.product_id, d.product_name, d.quantity, d.unit_price, d.total,
              p.is_active, COALESCE(s.quantity, 0) AS available,
              SUM(d.quantity) OVER (PARTITION BY d.product_id) AS needed
         FROM quotation_details d
         JOIN products p ON p.id = d.product_id
         LEFT JOIN inventory_locations l ON l.name = 'Vitrina'
         LEFT JOIN inventory_stock s ON s.product_id = d.product_id AND s.location_id = l.id
        WHERE d.quotation_id = $1
        ORDER BY d.product_name`,
      [id],
    );
    return rows.map((row) => ({
      productId: String(row.product_id),
      productName: String(row.product_name),
      quantity: Number(row.quantity),
      unitPrice: Number(row.unit_price),
      total: Number(row.total),
      available: Number(row.available),
      isActive: row.is_active === true,
      sufficient:
        row.is_active === true && Number(row.available) >= Number(row.needed),
    }));
  }

  /** Same `RAISE EXCEPTION '<CODE>:<id>'` → domain-error translation as `TypeOrmTicketRepository.translateTicketError` — see that method's own doc comment for why this parsing exists. */
  private translateQuotationError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const rule = quotationRuleErrorFromMessage(message);
    if (rule) {
      return rule;
    }
    const [code, id] = message.split(':');

    switch (code) {
      case 'QUOTATION_EMPTY':
        return new QuotationEmptyError();
      case 'CLIENT_NOT_FOUND':
        return new InvalidClientError();
      case 'INVALID_EXPIRATION_DATE':
        return new InvalidExpirationDateError();
      case 'PRODUCT_NOT_FOUND':
        return new QuotationProductNotFoundError(id);
      case 'PRODUCT_INACTIVE':
        return new QuotationProductInactiveError(id);
      case 'INVALID_QUANTITY':
        return new InvalidQuotationQuantityError(id);
      case 'INVALID_DISCOUNT':
        return new InvalidQuotationDiscountError(id);
      default:
        return error;
    }
  }
}
