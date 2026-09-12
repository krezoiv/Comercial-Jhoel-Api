import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryFailedError } from 'typeorm';
import { TransactionContext } from '../../../../shared/application/ports/transaction-manager.port';
import { RechargeSimSaleRegistration } from '../../domain/entities/recharge-sim-sale-registration.entity';
import {
  DpiImage,
  ListRechargeSimSaleRegistrationsFilters,
  ListRechargeSimSaleRegistrationsResult,
  RechargeSimSaleRegistrationRepository,
  RegisterRechargeSimSaleRegistrationData,
} from '../../domain/repositories/recharge-sim-sale-registration.repository';
import { RechargeSimSaleNotFoundError } from '../../domain/errors/recharge-sim-sale-not-found.error';
import { SimSaleRegistrationNotFoundError } from '../../domain/errors/sim-sale-registration-not-found.error';
import { SimSaleRegistrationAlreadyVoidedError } from '../../domain/errors/sim-sale-registration-already-voided.error';
import { SimSaleRegistrationVoidReasonRequiredError } from '../../domain/errors/sim-sale-registration-void-reason-required.error';
import { InvalidSimSaleClientError } from '../../domain/errors/invalid-sim-sale-client.error';
import { InvalidSimSalePriceError } from '../../domain/errors/invalid-sim-sale-price.error';
import { SimNumberRequiredError } from '../../domain/errors/sim-number-required.error';
import { SimSaleSkuRequiredError } from '../../domain/errors/sim-sale-sku-required.error';
import { ClientDpiRequiredError } from '../../domain/errors/client-dpi-required.error';
import { RechargeDayAlreadyClosedError } from '../../domain/errors/recharge-day-already-closed.error';
import {
  RechargeSimSaleRegistrationMapper,
  RechargeSimSaleRegistrationRow,
} from './recharge-sim-sale-registration.mapper';

/** Every column this repository's own JOIN needs — no TypeORM entity for `recharge_sim_sale_registrations` (see the mapper's own doc comment for why). */
// r.sale_date always goes through to_char(...) — a raw, unmapped query has
// no column metadata to hint the pg driver's type parser (unlike an
// entity-mapped find()/findOne()), so a bare DATE column comes back as a
// shifted-UTC-instant JS Date instead of the plain yyyy-MM-dd string every
// other date in this codebase produces. Same gotcha, same fix, already
// documented against modules/dashboard's own raw recharge-by-day query.
const SELECT_COLUMNS = `
  r.id, r.recharge_sim_sale_id, s.sim_type_id, t.name AS sim_type_name,
  r.sim_number, r.sku, r.client_dpi, r.client_id, c.name AS client_name,
  r.sale_price, to_char(r.sale_date, 'YYYY-MM-DD') AS sale_date,
  (r.dpi_image_id IS NOT NULL) AS has_dpi_image,
  r.is_voided, r.voided_at, r.voided_by, vu.username AS voided_by_username,
  r.void_reason, r.created_by, cu.username AS created_by_username, r.created_at
`;
const FROM_JOINS = `
  FROM recharge_sim_sale_registrations r
  JOIN recharge_sim_sales s ON s.id = r.recharge_sim_sale_id
  JOIN recharge_sim_types t ON t.id = s.sim_type_id
  JOIN users cu ON cu.id = r.created_by
  LEFT JOIN clients c ON c.id = r.client_id
  LEFT JOIN users vu ON vu.id = r.voided_by
`;

@Injectable()
export class TypeOrmRechargeSimSaleRegistrationRepository
  implements RechargeSimSaleRegistrationRepository
{
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private getManager(context?: TransactionContext): EntityManager {
    return (context as EntityManager) ?? this.dataSource.manager;
  }

  async create(
    data: RegisterRechargeSimSaleRegistrationData,
    context?: TransactionContext,
  ): Promise<RechargeSimSaleRegistration> {
    const manager = this.getManager(context);
    let id: string;
    try {
      const rows = await manager.query<{ register_recharge_sim_sale_registration: string }[]>(
        'SELECT register_recharge_sim_sale_registration($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [
          data.rechargeSimSaleId,
          data.simNumber,
          data.sku,
          data.clientDpi,
          data.clientId,
          data.salePrice,
          data.dpiImageId,
          data.saleDate,
          data.userId,
        ],
      );
      id = rows[0].register_recharge_sim_sale_registration;
    } catch (error) {
      throw this.translateError(error);
    }
    return this.fetchOrThrow(id, manager);
  }

  async findById(id: string): Promise<RechargeSimSaleRegistration | null> {
    const rows = await this.dataSource.manager.query<RechargeSimSaleRegistrationRow[]>(
      `SELECT ${SELECT_COLUMNS} ${FROM_JOINS} WHERE r.id = $1`,
      [id],
    );
    return rows[0] ? RechargeSimSaleRegistrationMapper.toDomain(rows[0]) : null;
  }

  async findAll(
    filters: ListRechargeSimSaleRegistrationsFilters,
  ): Promise<ListRechargeSimSaleRegistrationsResult> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filters.startDate) {
      params.push(filters.startDate);
      conditions.push(`r.sale_date >= $${params.length}`);
    }
    if (filters.endDate) {
      params.push(filters.endDate);
      conditions.push(`r.sale_date <= $${params.length}`);
    }
    if (filters.simTypeId) {
      params.push(filters.simTypeId);
      conditions.push(`s.sim_type_id = $${params.length}`);
    }
    if (filters.isVoided !== undefined) {
      params.push(filters.isVoided);
      conditions.push(`r.is_voided = $${params.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRows = await this.dataSource.manager.query<{ count: string }[]>(
      `SELECT COUNT(*) AS count ${FROM_JOINS} ${where}`,
      params,
    );
    const total = parseInt(countRows[0].count, 10);

    const offset = (filters.page - 1) * filters.limit;
    const dataParams = [...params, filters.limit, offset];
    const rows = await this.dataSource.manager.query<RechargeSimSaleRegistrationRow[]>(
      `SELECT ${SELECT_COLUMNS} ${FROM_JOINS} ${where}
       ORDER BY r.sale_date DESC, r.created_at DESC
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams,
    );

    return {
      items: rows.map(RechargeSimSaleRegistrationMapper.toDomain),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }

  async getTotalByDate(date: string): Promise<number> {
    // Mirrors register_recharge_sales_closure's own SIM-total computation
    // exactly (same LEFT JOIN/CASE shape) — every recharge_sim_sales row
    // for the date counts regardless of which "Vender SIM" flow created it;
    // a non-voided registration's own sale_price overrides the catalog
    // total_amount (it may be a negotiated price), a voided one contributes
    // 0, and a sale with no registration at all (the pre-existing
    // by-quantity flow) always counts at its own total_amount.
    const rows = await this.dataSource.manager.query<{ total: string }[]>(
      `SELECT COALESCE(SUM(
         CASE
           WHEN r.id IS NOT NULL AND r.is_voided = false THEN r.sale_price
           WHEN r.id IS NOT NULL AND r.is_voided = true THEN 0
           ELSE rss.total_amount
         END
       ), 0) AS total
       FROM recharge_sim_sales rss
       LEFT JOIN recharge_sim_sale_registrations r ON r.recharge_sim_sale_id = rss.id
       WHERE rss.sale_date = $1`,
      [date],
    );
    return parseFloat(rows[0].total);
  }

  async voidRegistration(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<RechargeSimSaleRegistration> {
    try {
      await this.dataSource.manager.query(
        'SELECT void_recharge_sim_sale_registration($1, $2, $3)',
        [id, voidedBy, reason],
      );
    } catch (error) {
      throw this.translateError(error);
    }
    return this.fetchOrThrow(id, this.dataSource.manager);
  }

  async saveDpiImage(
    data: Buffer,
    mimeType: string,
    userId: string,
    context?: TransactionContext,
  ): Promise<string> {
    const manager = this.getManager(context);
    const rows = await manager.query<{ id: string }[]>(
      `INSERT INTO recharge_sim_dpi_images (image_data, mime_type, size_bytes, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [data, mimeType, data.length, userId],
    );
    return rows[0].id;
  }

  async getDpiImage(registrationId: string): Promise<DpiImage | null> {
    const rows = await this.dataSource.manager.query<
      { image_data: Buffer; mime_type: string }[]
    >(
      `SELECT img.image_data, img.mime_type
       FROM recharge_sim_sale_registrations r
       JOIN recharge_sim_dpi_images img ON img.id = r.dpi_image_id
       WHERE r.id = $1`,
      [registrationId],
    );
    if (!rows[0]) {
      return null;
    }
    return { data: rows[0].image_data, mimeType: rows[0].mime_type };
  }

  private async fetchOrThrow(
    id: string,
    manager: EntityManager,
  ): Promise<RechargeSimSaleRegistration> {
    const rows = await manager.query<RechargeSimSaleRegistrationRow[]>(
      `SELECT ${SELECT_COLUMNS} ${FROM_JOINS} WHERE r.id = $1`,
      [id],
    );
    if (!rows[0]) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el registro de venta de SIM recién creado.',
      );
    }
    return RechargeSimSaleRegistrationMapper.toDomain(rows[0]);
  }

  /** Same `RAISE EXCEPTION '<CODE>:<extra>'` → domain-error translation pattern used throughout this module. */
  private translateError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ?? error.message;
    const [code] = message.split(':');

    switch (code) {
      case 'RECHARGE_SIM_SALE_NOT_FOUND':
        return new RechargeSimSaleNotFoundError(message.split(':')[1] ?? '');
      case 'SIM_NUMBER_REQUIRED':
        return new SimNumberRequiredError();
      case 'SIM_SALE_SKU_REQUIRED':
        return new SimSaleSkuRequiredError();
      case 'CLIENT_DPI_REQUIRED':
        return new ClientDpiRequiredError();
      case 'INVALID_SIM_SALE_PRICE':
        return new InvalidSimSalePriceError();
      case 'SIM_SALE_CLIENT_INVALID':
        return new InvalidSimSaleClientError();
      case 'RECHARGE_DAY_CLOSED':
        return new RechargeDayAlreadyClosedError(message.split(':')[1] ?? '');
      case 'VOID_REASON_REQUIRED':
        return new SimSaleRegistrationVoidReasonRequiredError();
      case 'SIM_SALE_REGISTRATION_NOT_FOUND':
        return new SimSaleRegistrationNotFoundError(message.split(':')[1] ?? '');
      case 'SIM_SALE_REGISTRATION_ALREADY_VOIDED':
        return new SimSaleRegistrationAlreadyVoidedError(message.split(':')[1] ?? '');
      default:
        return error;
    }
  }
}
