import { DayOpening } from '../entities/day-opening.entity';

export const DAY_OPENING_REPOSITORY = Symbol('DAY_OPENING_REPOSITORY');

export interface DayOpeningRepository {
  findByDate(date: string): Promise<DayOpening | null>;
  /** Idempotente: si la fecha ya está aperturada, devuelve la fila existente sin crear una segunda ni fallar. */
  open(date: string, userId: string): Promise<DayOpening>;
}
