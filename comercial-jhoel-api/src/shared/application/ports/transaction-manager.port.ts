export const TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER');

/** Opaque handle threaded through a repository's write methods so several calls share one DB transaction — see `TypeOrmTransactionManager`'s own doc comment for what it concretely is. */
export type TransactionContext = unknown;

/**
 * A port, not a direct TypeORM `DataSource` import — a use case that needs
 * two independent modules' repository writes to commit or roll back
 * together (e.g. registering a Transaccionar deposit and, optionally, its
 * linked Cuentas por Cobrar cargo) depends on this interface only, never on
 * TypeORM directly. Every participating repository method must accept the
 * `TransactionContext` this hands to `work()` and use it in place of its
 * own default connection when present — see
 * `TypeOrmBankDepositRepository.registerOperation`/
 * `TypeOrmAccountReceivableRepository.registerMovement` for the pattern.
 * Every existing caller that never passes a context is unaffected — this
 * is purely additive.
 */
export interface TransactionManager {
  runInTransaction<T>(
    work: (context: TransactionContext) => Promise<T>,
  ): Promise<T>;
}
