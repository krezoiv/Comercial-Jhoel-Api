/**
 * School-list money that customers paid by transfer/deposit and is still in
 * the banks, waiting to be moved to the Caja de Listas (migration
 * 1760008700000). Cuadre de Agentes subtracts it (owner decision): list money
 * never changes the agents' cuadre, neither when it arrives in a bank nor when
 * it is transferred to the Caja de Listas. A port of its own so the banks
 * module does not depend on the school-cash-box module.
 */
export const SCHOOL_LIST_PENDING_READER = Symbol('SCHOOL_LIST_PENDING_READER');

export interface SchoolListPendingReader {
  /** `school_cash_pending_total()` right now. */
  getPendingTotal(): Promise<number>;
}
