import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Quotation } from '../../domain/entities/quotation.entity';
import {
  CreateQuotationData,
  FindQuotationsOptions,
  PaginatedResult,
  QuotationRepository,
} from '../../domain/repositories/quotation.repository';
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

    let quotationId: string;
    try {
      const rows = await this.repository.manager.query<
        { create_quotation: string }[]
      >('SELECT create_quotation($1, $2, $3, $4::jsonb, $5, $6)', [
        data.userId,
        data.clientId,
        data.expirationDate,
        itemsJson,
        data.observations,
        data.commercialTerms,
      ]);
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
        '(client.name ILIKE :search OR quotation.quotationNumber ILIKE :search)',
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
      qb.andWhere('quotation.status = :status', { status: 'PENDIENTE' });
      qb.andWhere('quotation.expirationDate < :today', { today });
    } else if (options.status === 'PENDIENTE') {
      qb.andWhere('quotation.status = :status', { status: 'PENDIENTE' });
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

  async voidQuotation(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<Quotation> {
    await this.repository.update(
      { id },
      {
        status: 'ANULADA',
        voidedAt: new Date(),
        voidedBy,
        voidReason: reason,
      },
    );
    const quotation = await this.findById(id);
    if (!quotation) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la cotización recién anulada.',
      );
    }
    return quotation;
  }

  /** Same `RAISE EXCEPTION '<CODE>:<id>'` → domain-error translation as `TypeOrmTicketRepository.translateTicketError` — see that method's own doc comment for why this parsing exists. */
  private translateQuotationError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

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
