import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteVisitsRepository } from '../../domain/repositories/site-visits.repository';
import { SiteVisitsOrmEntity } from './site-visits.orm-entity';

@Injectable()
export class TypeOrmSiteVisitsRepository implements SiteVisitsRepository {
  constructor(
    @InjectRepository(SiteVisitsOrmEntity)
    private readonly repository: Repository<SiteVisitsOrmEntity>,
  ) {}

  async increment(): Promise<number> {
    // `manager.query()` devuelve `[rows, affectedCount]` para UPDATE...RETURNING
    // — a diferencia de INSERT...RETURNING, que devuelve solo el array de filas
    // (confirmado directamente, no asumido, con el driver pg de este proyecto;
    // ver el mismo tipo de gotcha ya documentado para `createDelivery()` en
    // `typeorm-news-push-subscription.repository.ts`, con el resultado
    // exactamente invertido).
    const [rows]: [{ total_count: number }[], number] = await this.repository.manager.query(
      `UPDATE "site_visits" SET "total_count" = "total_count" + 1, "updated_at" = now() WHERE "id" = 1 RETURNING "total_count"`,
    );
    return rows[0].total_count;
  }

  async getTotal(): Promise<number> {
    const rows: { total_count: number }[] = await this.repository.manager.query(
      `SELECT "total_count" FROM "site_visits" WHERE "id" = 1`,
    );
    return rows[0]?.total_count ?? 0;
  }
}
