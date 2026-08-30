import { AgentReconciliation } from '../../domain/entities/agent-reconciliation.entity';
import { AgentReconciliationOrmEntity } from './agent-reconciliation.orm-entity';

export class AgentReconciliationMapper {
  static toDomain(orm: AgentReconciliationOrmEntity): AgentReconciliation {
    return AgentReconciliation.create({
      id: orm.id,
      date: orm.date,
      totalCash: orm.totalCash,
      totalBanks: orm.totalBanks,
      totalAssets: orm.totalAssets,
      totalAccountsReceivable: orm.totalAccountsReceivable,
      result: orm.result,
      createdAt: orm.createdAt,
      createdBy: orm.createdBy,
      createdByUsername: orm.createdByUser?.username ?? '',
    });
  }
}
