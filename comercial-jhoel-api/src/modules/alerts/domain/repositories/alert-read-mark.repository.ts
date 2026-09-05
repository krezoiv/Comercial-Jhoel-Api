export const ALERT_READ_MARK_REPOSITORY = Symbol('ALERT_READ_MARK_REPOSITORY');

export interface AlertReadMarkRepository {
  /** Every key this user has marked read, restricted to the given candidate keys (never the whole table — bounded by "alerts active right now", same reasoning documented on `GetAlertsUseCase`). */
  findReadKeys(userId: string, keys: string[]): Promise<Set<string>>;
  /** Upsert — marking an already-read alert read again is a no-op, not an error. */
  markRead(userId: string, key: string): Promise<void>;
  markAllRead(userId: string, keys: string[]): Promise<void>;
}
