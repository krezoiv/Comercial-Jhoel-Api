import {
  RechargeDayAuditAction,
  RechargeDayAuditLog,
} from '../../domain/entities/recharge-day-audit-log.entity';
import { RechargeDayAuditLogOrmEntity } from './recharge-day-audit-log.orm-entity';

export class RechargeDayAuditLogMapper {
  static toDomain(orm: RechargeDayAuditLogOrmEntity): RechargeDayAuditLog {
    return RechargeDayAuditLog.create({
      id: orm.id,
      date: orm.date,
      action: orm.action as RechargeDayAuditAction,
      performedBy: orm.performedBy,
      performedByUsername: orm.performedByUser?.username ?? '',
      performedAt: orm.performedAt,
      reason: orm.reason,
      previousStatus: orm.previousStatus,
      newStatus: orm.newStatus,
    });
  }
}
