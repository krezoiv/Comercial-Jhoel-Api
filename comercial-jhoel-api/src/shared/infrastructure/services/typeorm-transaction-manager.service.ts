import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import {
  TransactionContext,
  TransactionManager,
} from '../../application/ports/transaction-manager.port';

/**
 * The concrete `TransactionManager` bound in `SharedModule`. The
 * `TransactionContext` handed to `work()` is, concretely, a TypeORM
 * `EntityManager` scoped to one transaction — a repository method that
 * accepts it does `(context as EntityManager | undefined) ?? this.repository.manager`
 * before calling `.query(...)`, so every existing caller (which passes no
 * context) is byte-identical to before this port existed.
 */
@Injectable()
export class TypeOrmTransactionManager implements TransactionManager {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  runInTransaction<T>(
    work: (context: TransactionContext) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction((manager: EntityManager) =>
      work(manager),
    );
  }
}
