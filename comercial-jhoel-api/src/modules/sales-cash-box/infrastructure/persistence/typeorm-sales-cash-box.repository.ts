import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { SalesCashBoxMovement } from '../../domain/entities/sales-cash-box-movement.entity';
import {
  RegisterSalesCashBoxMovementData,
  SalesCashBoxBalance,
  SalesCashBoxMovementRepository,
} from '../../domain/repositories/sales-cash-box-movement.repository';
import { InvalidMovementAmountError } from '../../domain/errors/invalid-movement-amount.error';
import { InvalidMovementConceptError } from '../../domain/errors/invalid-movement-concept.error';
import { WithdrawalExceedsBalanceError } from '../../domain/errors/withdrawal-exceeds-balance.error';
import { InvalidCashBoxBusinessError } from '../../domain/errors/invalid-cash-box-business.error';
import { SalesCashBoxMovementOrmEntity } from './sales-cash-box-movement.orm-entity';
import { SalesCashBoxMovementMapper } from './sales-cash-box-movement.mapper';

/**
 * Lee `sale_details`/`sales` en vivo (nunca una copia) para la parte
 * "ventas" del saldo de cada negocio — mismo patrón ya documentado en
 * `TypeOrmRechargeCashBoxRepository` para sus cuatro tablas fuente.
 * `sales_cash_box_movements` es la única tabla propia de este repositorio.
 */
@Injectable()
export class TypeOrmSalesCashBoxRepository
  implements SalesCashBoxMovementRepository
{
  constructor(
    @InjectRepository(SalesCashBoxMovementOrmEntity)
    private readonly movementRepository: Repository<SalesCashBoxMovementOrmEntity>,
  ) {}

  async registerMovement(
    data: RegisterSalesCashBoxMovementData,
  ): Promise<SalesCashBoxMovement> {
    let id: string;
    try {
      const rows = await this.movementRepository.manager.query<
        { register_sales_cash_box_movement: string }[]
      >('SELECT register_sales_cash_box_movement($1, $2, $3, $4, $5)', [
        data.businessId,
        data.amount,
        data.movementType,
        data.concept,
        data.userId,
      ]);
      id = rows[0].register_sales_cash_box_movement;
    } catch (error) {
      throw this.translateCashBoxError(error);
    }
    return this.fetchOrThrow(id);
  }

  async voidMovement(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<SalesCashBoxMovement> {
    await this.movementRepository.update(
      { id },
      {
        isVoided: true,
        voidedAt: new Date(),
        voidedByUserId: voidedBy,
        voidReason: reason,
      },
    );
    return this.fetchOrThrow(id);
  }

  async findById(id: string): Promise<SalesCashBoxMovement | null> {
    const orm = await this.movementRepository.findOne({ where: { id } });
    return orm ? SalesCashBoxMovementMapper.toDomain(orm) : null;
  }

  private async fetchOrThrow(id: string): Promise<SalesCashBoxMovement> {
    const movement = await this.findById(id);
    if (!movement) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el movimiento de caja recién registrado.',
      );
    }
    return movement;
  }

  /**
   * Un solo query para TODOS los negocios activos — nunca una llamada por
   * negocio. `sales`/`contrib`/`withd` son subconsultas agregadas
   * independientes, unidas por `LEFT JOIN` para que un negocio sin ninguna
   * venta/aporte/retiro todavía aparezca con saldo `0`, no ausente.
   */
  async getBalances(): Promise<SalesCashBoxBalance[]> {
    const rows = await this.movementRepository.manager.query<
      { business_id: string; business_name: string; balance: string }[]
    >(`
      SELECT
        b.id AS business_id,
        b.name AS business_name,
        COALESCE(sales.total, 0) + COALESCE(contrib.total, 0) - COALESCE(withd.total, 0) AS balance
      FROM businesses b
      LEFT JOIN (
        SELECT sd.business_id, SUM(sd.total) AS total
        FROM sale_details sd
        JOIN sales s ON s.id = sd.sale_id
        WHERE s.status = 'CONFIRMED' AND s.is_voided = false
        GROUP BY sd.business_id
      ) sales ON sales.business_id = b.id
      LEFT JOIN (
        SELECT business_id, SUM(amount) AS total
        FROM sales_cash_box_movements
        WHERE movement_type = 'CONTRIBUTION' AND is_voided = false
        GROUP BY business_id
      ) contrib ON contrib.business_id = b.id
      LEFT JOIN (
        SELECT business_id, SUM(amount) AS total
        FROM sales_cash_box_movements
        WHERE movement_type = 'WITHDRAWAL' AND is_voided = false
        GROUP BY business_id
      ) withd ON withd.business_id = b.id
      WHERE b.is_active = true
      ORDER BY b.name ASC
    `);

    return rows.map((row) => ({
      businessId: row.business_id,
      businessName: row.business_name,
      balance: parseFloat(row.balance),
    }));
  }

  async findMovements(
    businessId: string,
    limit: number,
  ): Promise<SalesCashBoxMovement[]> {
    const orms = await this.movementRepository.find({
      where: { businessId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return orms.map(SalesCashBoxMovementMapper.toDomain);
  }

  /** Mismo patrón `RAISE EXCEPTION '<CODE>[:extra]'` → error de dominio que `translateCashBoxError` de Recargas. */
  private translateCashBoxError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const [code] = message.split(':');

    switch (code) {
      case 'INVALID_MOVEMENT_AMOUNT':
        return new InvalidMovementAmountError();
      case 'INVALID_MOVEMENT_CONCEPT':
        return new InvalidMovementConceptError();
      case 'WITHDRAWAL_EXCEEDS_BALANCE':
        return new WithdrawalExceedsBalanceError();
      case 'BUSINESS_NOT_FOUND':
        return new InvalidCashBoxBusinessError();
      default:
        return error;
    }
  }
}
