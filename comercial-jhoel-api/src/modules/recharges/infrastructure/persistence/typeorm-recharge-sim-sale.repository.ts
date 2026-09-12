import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import { RechargeSimSale } from '../../domain/entities/recharge-sim-sale.entity';
import { RechargeSimSaleRepository } from '../../domain/repositories/recharge-sim-sale.repository';
import { RechargeSimSaleNotFoundError } from '../../domain/errors/recharge-sim-sale-not-found.error';
import { SimSaleAlreadyVoidedError } from '../../domain/errors/sim-sale-already-voided.error';
import { SimSaleVoidReasonRequiredError } from '../../domain/errors/sim-sale-void-reason-required.error';
import { SimSaleHasRegistrationError } from '../../domain/errors/sim-sale-has-registration.error';
import { SimSaleDayClosedError } from '../../domain/errors/sim-sale-day-closed.error';
import { RechargeSimSaleMapper, RechargeSimSaleRow } from './recharge-sim-sale.mapper';

/** Every column this repository's own JOIN needs — no TypeORM entity for `recharge_sim_sales` (see the mapper's own doc comment). `sale_date` goes through `to_char(...)` for the same raw-query date gotcha documented against `TypeOrmRechargeSimSaleRegistrationRepository`. */
const SELECT_COLUMNS = `
  rss.id, rss.sim_type_id, t.name AS sim_type_name, rss.daily_stock_id,
  rss.quantity, rss.unit_price, rss.total_amount,
  to_char(rss.sale_date, 'YYYY-MM-DD') AS sale_date,
  EXISTS(
    SELECT 1 FROM recharge_sim_sale_registrations r
    WHERE r.recharge_sim_sale_id = rss.id AND r.is_voided = false
  ) AS has_active_registration,
  rss.created_by, cu.username AS created_by_username, rss.created_at,
  rss.is_voided, rss.voided_at, rss.voided_by, vu.username AS voided_by_username,
  rss.void_reason
`;
const FROM_JOINS = `
  FROM recharge_sim_sales rss
  JOIN recharge_sim_types t ON t.id = rss.sim_type_id
  JOIN users cu ON cu.id = rss.created_by
  LEFT JOIN users vu ON vu.id = rss.voided_by
`;

@Injectable()
export class TypeOrmRechargeSimSaleRepository implements RechargeSimSaleRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findAllByDate(date: string): Promise<RechargeSimSale[]> {
    // A sale created via the identity-registration flow always has exactly
    // one recharge_sim_sale_registrations row (active or voided — the
    // registration function is only ever called once per such sale). This
    // WHERE NOT EXISTS is what permanently keeps this "Vender SIM" (by
    // quantity) listing/void screen separate from "Administrar Ventas de
    // SIM" — the two flows never contest the same physical sale row.
    const rows = await this.dataSource.manager.query<RechargeSimSaleRow[]>(
      `SELECT ${SELECT_COLUMNS} ${FROM_JOINS}
       WHERE rss.sale_date = $1
         AND NOT EXISTS (
           SELECT 1 FROM recharge_sim_sale_registrations r
           WHERE r.recharge_sim_sale_id = rss.id
         )
       ORDER BY rss.created_at DESC`,
      [date],
    );
    return rows.map((row) => RechargeSimSaleMapper.toDomain(row));
  }

  async findById(id: string): Promise<RechargeSimSale | null> {
    const rows = await this.dataSource.manager.query<RechargeSimSaleRow[]>(
      `SELECT ${SELECT_COLUMNS} ${FROM_JOINS} WHERE rss.id = $1`,
      [id],
    );
    return rows[0] ? RechargeSimSaleMapper.toDomain(rows[0]) : null;
  }

  async voidSale(id: string, voidedBy: string, reason: string): Promise<RechargeSimSale> {
    try {
      await this.dataSource.manager.query('SELECT void_recharge_sim_sale($1, $2, $3)', [
        id,
        voidedBy,
        reason,
      ]);
    } catch (error) {
      throw this.translateVoidError(error, id);
    }

    const sale = await this.findById(id);
    if (!sale) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la venta de SIM recién anulada.',
      );
    }
    return sale;
  }

  /** Same `RAISE EXCEPTION '<CODE>:<id>'` → domain-error translation pattern as `translatePurchaseVoidError`. */
  private translateVoidError(error: unknown, id: string): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ?? error.message;

    const [code] = message.split(':');

    switch (code) {
      case 'VOID_REASON_REQUIRED':
        return new SimSaleVoidReasonRequiredError();
      case 'SIM_SALE_NOT_FOUND':
        return new RechargeSimSaleNotFoundError(id);
      case 'SIM_SALE_ALREADY_VOIDED':
        return new SimSaleAlreadyVoidedError();
      case 'SIM_SALE_HAS_REGISTRATION':
        return new SimSaleHasRegistrationError();
      case 'RECHARGE_DAY_CLOSED':
        return new SimSaleDayClosedError();
      default:
        return error;
    }
  }
}
