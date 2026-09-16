import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import { PhoneSale } from '../../domain/entities/phone-sale.entity';
import {
  DpiImage,
  PhoneSaleRepository,
  RegisterPhoneSaleData,
} from '../../domain/repositories/phone-sale.repository';
import { PhoneNotFoundError } from '../../domain/errors/phone-not-found.error';
import { PhoneAlreadySoldError } from '../../domain/errors/phone-already-sold.error';
import { ClientDpiRequiredError } from '../../domain/errors/client-dpi-required.error';
import { PhoneNumberRequiredError } from '../../domain/errors/phone-number-required.error';
import { PhoneNumberAlreadyAssignedError } from '../../domain/errors/phone-number-already-assigned.error';
import { InvalidPhoneSaleClientError } from '../../domain/errors/invalid-phone-sale-client.error';
import { PhoneSaleNotFoundError } from '../../domain/errors/phone-sale-not-found.error';
import { PhoneSaleAlreadyVoidedError } from '../../domain/errors/phone-sale-already-voided.error';
import { PhoneSaleVoidReasonRequiredError } from '../../domain/errors/phone-sale-void-reason-required.error';
import { PhoneSaleMapper, PhoneSaleRow } from './phone-sale.mapper';

const SELECT_COLUMNS = `
  s.id, s.phone_id, p.operator AS phone_operator, p.model AS phone_model,
  s.phone_number, p.imei AS phone_imei, p.sim_number AS phone_sim_number,
  p.cost_price AS phone_cost_price,
  s.client_id, c.name AS client_name, s.client_dpi, s.sale_price,
  to_char(s.sale_date, 'YYYY-MM-DD') AS sale_date,
  (s.dpi_image_id IS NOT NULL) AS has_dpi_image,
  s.is_voided, s.voided_at, s.voided_by, vu.username AS voided_by_username,
  s.void_reason, s.created_by, cu.username AS created_by_username, s.created_at
`;
const FROM_JOINS = `
  FROM phone_sales s
  JOIN phones p ON p.id = s.phone_id
  LEFT JOIN clients c ON c.id = s.client_id
  JOIN users cu ON cu.id = s.created_by
  LEFT JOIN users vu ON vu.id = s.voided_by
`;

@Injectable()
export class TypeOrmPhoneSaleRepository implements PhoneSaleRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async create(data: RegisterPhoneSaleData): Promise<PhoneSale> {
    let id: string;
    try {
      const rows = await this.dataSource.manager.query<
        { register_phone_sale: string }[]
      >('SELECT register_phone_sale($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
        data.phoneId,
        data.clientId,
        data.clientDpi,
        data.phoneNumber,
        data.saleDate,
        data.dpiImage?.data ?? null,
        data.dpiImage?.mimeType ?? null,
        data.dpiImage?.sizeBytes ?? null,
        data.createdBy,
      ]);
      id = rows[0].register_phone_sale;
    } catch (error) {
      throw this.translateError(error);
    }
    return this.fetchOrThrow(id);
  }

  async findById(id: string): Promise<PhoneSale | null> {
    const rows = await this.dataSource.manager.query<PhoneSaleRow[]>(
      `SELECT ${SELECT_COLUMNS} ${FROM_JOINS} WHERE s.id = $1`,
      [id],
    );
    return rows[0] ? PhoneSaleMapper.toDomain(rows[0]) : null;
  }

  async findAll(): Promise<PhoneSale[]> {
    const rows = await this.dataSource.manager.query<PhoneSaleRow[]>(
      `SELECT ${SELECT_COLUMNS} ${FROM_JOINS} ORDER BY s.sale_date DESC, s.created_at DESC`,
    );
    return rows.map((row) => PhoneSaleMapper.toDomain(row));
  }

  async voidSale(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<PhoneSale> {
    try {
      await this.dataSource.manager.query(
        'SELECT void_phone_sale($1, $2, $3)',
        [id, voidedBy, reason],
      );
    } catch (error) {
      throw this.translateError(error);
    }
    return this.fetchOrThrow(id);
  }

  async getDpiImage(saleId: string): Promise<DpiImage | null> {
    const rows = await this.dataSource.manager.query<
      { image_data: Buffer; mime_type: string }[]
    >(
      `SELECT img.image_data, img.mime_type
       FROM phone_sales s
       JOIN phone_sale_dpi_images img ON img.id = s.dpi_image_id
       WHERE s.id = $1`,
      [saleId],
    );
    if (!rows[0]) {
      return null;
    }
    return { data: rows[0].image_data, mimeType: rows[0].mime_type };
  }

  private async fetchOrThrow(id: string): Promise<PhoneSale> {
    const rows = await this.dataSource.manager.query<PhoneSaleRow[]>(
      `SELECT ${SELECT_COLUMNS} ${FROM_JOINS} WHERE s.id = $1`,
      [id],
    );
    if (!rows[0]) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la venta de teléfono recién creada.',
      );
    }
    return PhoneSaleMapper.toDomain(rows[0]);
  }

  /** Same `RAISE EXCEPTION '<CODE>:<extra>'` → domain-error translation pattern used throughout `recharges`/`purchases`. */
  private translateError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const [code, extra] = message.split(':');

    switch (code) {
      case 'PHONE_NOT_FOUND':
        return new PhoneNotFoundError(extra ?? '');
      case 'PHONE_ALREADY_SOLD':
        return new PhoneAlreadySoldError(extra ?? '');
      case 'CLIENT_DPI_REQUIRED':
        return new ClientDpiRequiredError();
      case 'PHONE_NUMBER_REQUIRED':
        return new PhoneNumberRequiredError();
      case 'PHONE_NUMBER_ALREADY_ASSIGNED':
        return new PhoneNumberAlreadyAssignedError(extra ?? '');
      case 'PHONE_SALE_CLIENT_INVALID':
        return new InvalidPhoneSaleClientError();
      case 'VOID_REASON_REQUIRED':
        return new PhoneSaleVoidReasonRequiredError();
      case 'PHONE_SALE_NOT_FOUND':
        return new PhoneSaleNotFoundError(extra ?? '');
      case 'PHONE_SALE_ALREADY_VOIDED':
        return new PhoneSaleAlreadyVoidedError(extra ?? '');
      default:
        return error;
    }
  }
}
