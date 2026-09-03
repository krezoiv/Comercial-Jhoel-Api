import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { RechargeDayNotOpenedError } from '../../domain/errors/recharge-day-not-opened.error';
import { RechargeDayAlreadyClosedError } from '../../domain/errors/recharge-day-already-closed.error';
import { todayIsoDate } from './today-iso-date';

/**
 * The mandatory "Apertura del Día" sequencing only applies to TODAY's
 * operating date — correcting a past date is pre-existing functionality
 * this ticket was required to preserve unchanged (see Banks'
 * `SaveBankBalancesUseCase`, which established this exact rule first for
 * its own module). Shared by every write use case that needs it (purchase,
 * sale, saldo final, cuadre save) rather than duplicated four times.
 */
export async function assertRechargeDayWritable(
  repository: RechargeDayOpeningRepository,
  date: string,
): Promise<void> {
  const dayOpening = await repository.findByDate(date);

  if (date === todayIsoDate() && !dayOpening) {
    throw new RechargeDayNotOpenedError(date);
  }

  if (dayOpening?.isClosed) {
    throw new RechargeDayAlreadyClosedError(date);
  }
}
