import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RechargeDayAuditLog } from '../../domain/entities/recharge-day-audit-log.entity';
import {
  CreateRechargeDayAuditLogData,
  RechargeDayAuditLogRepository,
} from '../../domain/repositories/recharge-day-audit-log.repository';
import { RechargeDayAuditLogOrmEntity } from './recharge-day-audit-log.orm-entity';
import { RechargeDayAuditLogMapper } from './recharge-day-audit-log.mapper';

@Injectable()
export class TypeOrmRechargeDayAuditLogRepository implements RechargeDayAuditLogRepository {
  constructor(
    @InjectRepository(RechargeDayAuditLogOrmEntity)
    private readonly repository: Repository<RechargeDayAuditLogOrmEntity>,
  ) {}

  async findByDate(date: string): Promise<RechargeDayAuditLog[]> {
    const orms = await this.repository.find({
      where: { date },
      order: { performedAt: 'ASC' },
    });
    return orms.map((orm) => RechargeDayAuditLogMapper.toDomain(orm));
  }

  async record(
    data: CreateRechargeDayAuditLogData,
  ): Promise<RechargeDayAuditLog> {
    const orm = this.repository.create({
      date: data.date,
      action: data.action,
      performedBy: data.performedBy,
      reason: data.reason ?? null,
      previousStatus: data.previousStatus ?? null,
      newStatus: data.newStatus ?? null,
    });
    const saved = await this.repository.save(orm);
    const withRelations = await this.repository.findOneOrFail({
      where: { id: saved.id },
    });
    return RechargeDayAuditLogMapper.toDomain(withRelations);
  }
}
