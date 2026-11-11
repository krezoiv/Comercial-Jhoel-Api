import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WarehouseCashReader } from '../../domain/repositories/warehouse-cash.reader';

/** `SELECT warehouse_cash_balance()` (migration 1760007400000). */
@Injectable()
export class TypeOrmWarehouseCashReader implements WarehouseCashReader {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getBalance(): Promise<number> {
    const [row] = await this.dataSource.query<
      Array<{ balance: string | null }>
    >('SELECT warehouse_cash_balance() AS balance');
    return Number(row?.balance ?? 0);
  }
}
