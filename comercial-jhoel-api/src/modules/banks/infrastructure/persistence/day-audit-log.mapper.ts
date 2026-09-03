import {
  DayAuditAction,
  DayAuditLog,
} from '../../domain/entities/day-audit-log.entity';
import { DayAuditLogOrmEntity } from './day-audit-log.orm-entity';

export class DayAuditLogMapper {
  static toDomain(orm: DayAuditLogOrmEntity): DayAuditLog {
    return DayAuditLog.create({
      id: orm.id,
      date: orm.date,
      action: orm.action as DayAuditAction,
      performedBy: orm.performedBy,
      performedByUsername: orm.performedByUser?.username ?? '',
      performedAt: orm.performedAt,
      reason: orm.reason,
      previousStatus: orm.previousStatus,
      newStatus: orm.newStatus,
    });
  }
}
