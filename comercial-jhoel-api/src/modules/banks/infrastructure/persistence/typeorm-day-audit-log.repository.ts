import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DayAuditLog } from '../../domain/entities/day-audit-log.entity';
import {
  CreateDayAuditLogData,
  DayAuditLogRepository,
} from '../../domain/repositories/day-audit-log.repository';
import { DayAuditLogOrmEntity } from './day-audit-log.orm-entity';
import { DayAuditLogMapper } from './day-audit-log.mapper';

@Injectable()
export class TypeOrmDayAuditLogRepository implements DayAuditLogRepository {
  constructor(
    @InjectRepository(DayAuditLogOrmEntity)
    private readonly repository: Repository<DayAuditLogOrmEntity>,
  ) {}

  async findByDate(date: string): Promise<DayAuditLog[]> {
    const orms = await this.repository.find({ where: { date }, order: { performedAt: 'ASC' } });
    return orms.map((orm) => DayAuditLogMapper.toDomain(orm));
  }

  async record(data: CreateDayAuditLogData): Promise<DayAuditLog> {
    const orm = this.repository.create({
      date: data.date,
      action: data.action,
      performedBy: data.performedBy,
      reason: data.reason ?? null,
      previousStatus: data.previousStatus ?? null,
      newStatus: data.newStatus ?? null,
    });
    const saved = await this.repository.save(orm);
    const withRelations = await this.repository.findOneOrFail({ where: { id: saved.id } });
    return DayAuditLogMapper.toDomain(withRelations);
  }
}
