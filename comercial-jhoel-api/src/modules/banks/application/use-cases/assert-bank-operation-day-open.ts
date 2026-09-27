import type { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import {
  BankOperationDayClosedError,
  BankOperationDayNotOpenedError,
} from '../../domain/errors/bank-movement.errors';

/**
 * Las operaciones que mueven saldo (transferencias) respetan el mismo ciclo
 * de día abierto/cerrado que Transaccionar y el cuadre — nunca un ciclo
 * paralelo. Los ajustes manuales y las anulaciones (acciones de
 * administración) no pasan por aquí, igual que la anulación de
 * Transaccionar o la reapertura de días.
 */
export async function assertBankOperationDayOpen(
  dayOpeningRepository: DayOpeningRepository,
  businessDate: string,
): Promise<void> {
  const dayOpening = await dayOpeningRepository.findByDate(businessDate);
  if (!dayOpening) {
    throw new BankOperationDayNotOpenedError(businessDate);
  }
  if (dayOpening.isClosed) {
    throw new BankOperationDayClosedError(businessDate);
  }
}
