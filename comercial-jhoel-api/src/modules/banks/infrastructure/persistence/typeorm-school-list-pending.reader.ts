import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SchoolListPendingReader } from '../../domain/repositories/school-list-pending.reader';

/** `SELECT school_cash_pending_total()` (migration 1760008700000). */
@Injectable()
export class TypeOrmSchoolListPendingReader implements SchoolListPendingReader {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getPendingTotal(): Promise<number> {
    const [row] = await this.dataSource.query<Array<{ total: string | null }>>(
      'SELECT school_cash_pending_total() AS total',
    );
    return Number(row?.total ?? 0);
  }
}
