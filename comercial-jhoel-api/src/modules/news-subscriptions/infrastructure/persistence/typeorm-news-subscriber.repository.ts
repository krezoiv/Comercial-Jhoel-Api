import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  CreateNewsSubscriberData,
  NewsSubscriberAuditEntry,
  NewsSubscriberListItem,
  NewsSubscriberRepository,
  NewsSubscriberTypeSummary,
  RecordNewsSubscriberAuditData,
} from '../../domain/repositories/news-subscriber.repository';
import { NewsSubscriberOrmEntity } from './news-subscriber.orm-entity';
import { NewsSubscriberTypeOrmEntity } from './news-subscriber-type.orm-entity';
import { NewsSubscriberAuditLogOrmEntity } from './news-subscriber-audit-log.orm-entity';

@Injectable()
export class TypeOrmNewsSubscriberRepository implements NewsSubscriberRepository {
  constructor(
    @InjectRepository(NewsSubscriberOrmEntity)
    private readonly repository: Repository<NewsSubscriberOrmEntity>,
    @InjectRepository(NewsSubscriberAuditLogOrmEntity)
    private readonly auditRepository: Repository<NewsSubscriberAuditLogOrmEntity>,
  ) {}

  /**
   * Batch — una sola consulta para los tipos de todos los suscriptores del
   * listado, nunca N+1. Acepta un `manager` explícito para poder leer
   * dentro de la MISMA transacción que acaba de escribir (leer por el
   * manager por defecto del repositorio, en otra conexión, vería la
   * transacción todavía sin confirmar — bug real ya encontrado y corregido
   * aquí en pruebas end-to-end).
   */
  private async batchTypesFor(
    subscriberIds: string[],
    manager: EntityManager = this.repository.manager,
  ): Promise<Map<string, NewsSubscriberTypeSummary[]>> {
    const map = new Map<string, NewsSubscriberTypeSummary[]>();
    if (subscriberIds.length === 0) {
      return map;
    }
    const rows: Array<{
      subscriber_id: string;
      id: string;
      name: string;
      slug: string;
      is_wildcard: boolean;
    }> = await manager.query(
      `SELECT nst.subscriber_id, nt.id, nt.name, nt.slug, nt.is_wildcard
       FROM news_subscriber_types nst
       JOIN news_types nt ON nt.id = nst.news_type_id
       WHERE nst.subscriber_id = ANY($1::uuid[])
       ORDER BY nt.sort_order ASC`,
      [subscriberIds],
    );
    for (const row of rows) {
      const list = map.get(row.subscriber_id) ?? [];
      list.push({ id: row.id, name: row.name, slug: row.slug, isWildcard: row.is_wildcard });
      map.set(row.subscriber_id, list);
    }
    return map;
  }

  /** Construye el item plano directamente desde las columnas del ORM — nunca copiando (spread) una instancia de dominio, cuyos getters no son propiedades propias enumerables. */
  private toItem(orm: NewsSubscriberOrmEntity, types: NewsSubscriberTypeSummary[]): NewsSubscriberListItem {
    return {
      id: orm.id,
      whatsappNumber: orm.whatsappNumber,
      name: orm.name,
      isActive: orm.isActive,
      consentGiven: orm.consentGiven,
      consentAt: orm.consentAt,
      manageToken: orm.manageToken,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      types,
    };
  }

  private async toListItem(orm: NewsSubscriberOrmEntity): Promise<NewsSubscriberListItem> {
    const types = (await this.batchTypesFor([orm.id])).get(orm.id) ?? [];
    return this.toItem(orm, types);
  }

  async findAll(options?: { activeOnly?: boolean }): Promise<NewsSubscriberListItem[]> {
    const qb = this.repository.createQueryBuilder('s').orderBy('s.createdAt', 'DESC');
    if (options?.activeOnly) {
      qb.andWhere('s.isActive = true');
    }
    const orms = await qb.getMany();
    const typesBySubscriber = await this.batchTypesFor(orms.map((orm) => orm.id));
    return orms.map((orm) => this.toItem(orm, typesBySubscriber.get(orm.id) ?? []));
  }

  async findById(id: string): Promise<NewsSubscriberListItem | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.toListItem(orm) : null;
  }

  async findActiveByWhatsapp(whatsappNumber: string): Promise<NewsSubscriberListItem | null> {
    const orm = await this.repository.findOne({ where: { whatsappNumber, isActive: true } });
    return orm ? this.toListItem(orm) : null;
  }

  async findByManageToken(token: string): Promise<NewsSubscriberListItem | null> {
    const orm = await this.repository.findOne({ where: { manageToken: token } });
    return orm ? this.toListItem(orm) : null;
  }

  async createWithTypes(data: CreateNewsSubscriberData): Promise<NewsSubscriberListItem> {
    return this.repository.manager.transaction(async (manager) => {
      const created = await manager.save(
        manager.create(NewsSubscriberOrmEntity, {
          whatsappNumber: data.whatsappNumber,
          name: data.name,
          consentGiven: true,
          consentAt: data.consentAt,
        }),
      );
      if (data.typeIds.length > 0) {
        await manager
          .createQueryBuilder()
          .insert()
          .into(NewsSubscriberTypeOrmEntity)
          .values(data.typeIds.map((newsTypeId) => ({ subscriberId: created.id, newsTypeId })))
          .orIgnore()
          .execute();
      }
      // `.save()` no devuelve columnas con DEFAULT calculado en la BD (ej.
      // `manage_token gen_random_uuid()`) — hay que releer la fila, mismo
      // gotcha ya documentado en otros repositorios de este proyecto para
      // relaciones eager tras `.save()`.
      const subscriber = await manager.findOneOrFail(NewsSubscriberOrmEntity, { where: { id: created.id } });
      const types = (await this.batchTypesFor([subscriber.id], manager)).get(subscriber.id) ?? [];
      return this.toItem(subscriber, types);
    });
  }

  async replaceTypes(subscriberId: string, typeIds: string[]): Promise<void> {
    await this.repository.manager.transaction(async (manager) => {
      await manager.delete(NewsSubscriberTypeOrmEntity, { subscriberId });
      if (typeIds.length > 0) {
        await manager
          .createQueryBuilder()
          .insert()
          .into(NewsSubscriberTypeOrmEntity)
          .values(typeIds.map((newsTypeId) => ({ subscriberId, newsTypeId })))
          .orIgnore()
          .execute();
      }
    });
  }

  async setConsent(subscriberId: string, consentAt: Date): Promise<void> {
    await this.repository.update({ id: subscriberId }, { consentGiven: true, consentAt });
  }

  async setActive(subscriberId: string, isActive: boolean): Promise<void> {
    await this.repository.update({ id: subscriberId }, { isActive });
  }

  async recordAudit(data: RecordNewsSubscriberAuditData): Promise<void> {
    await this.auditRepository.save(
      this.auditRepository.create({
        subscriberId: data.subscriberId,
        action: data.action,
        previousTypeIds: data.previousTypeIds,
        newTypeIds: data.newTypeIds,
        performedBy: data.performedBy,
      }),
    );
  }

  async findAuditLog(subscriberId: string): Promise<NewsSubscriberAuditEntry[]> {
    const orms = await this.auditRepository.find({
      where: { subscriberId },
      order: { createdAt: 'DESC' },
    });
    return orms.map((orm) => ({
      id: orm.id,
      action: orm.action,
      previousTypeIds: orm.previousTypeIds,
      newTypeIds: orm.newTypeIds,
      performedBy: orm.performedBy,
      performedByUsername: orm.performedByUser?.username ?? orm.performedByUser?.name ?? null,
      createdAt: orm.createdAt,
    }));
  }
}
