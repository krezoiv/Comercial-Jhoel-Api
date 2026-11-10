import { Inject, Injectable } from '@nestjs/common';
import { CASH_CONTROL_REPOSITORY } from '../../domain/repositories/cash-control.repository';
import type {
  CashBankVerificationData,
  CashControlRepository,
  CashDenominationData,
} from '../../domain/repositories/cash-control.repository';
import { cashControlError } from '../../domain/errors/cash-control.errors';
import {
  CASH_CUT_MANAGER_ROLES,
  assertCutSchedule,
  guatemalaIsoDate,
  guatemalaTime,
  isCashAdmin,
  isValidCutTime,
  requireReason,
} from '../../domain/policies/cash-control.policy';
import {
  CashPositionOutput,
  GetCashPositionUseCase,
} from './get-cash-position.use-case';

/** Defense in depth: the controller's `@Roles` already restricts these routes. */
function assertCutManager(role: string): void {
  if (!(CASH_CUT_MANAGER_ROLES as readonly string[]).includes(role)) {
    throw cashControlError('CASH_FORBIDDEN');
  }
}

export interface OpenCashDayInput {
  userId: string;
  role: string;
  /** Admin-authorized opening amount; omitted = inherit from the last counted cut. */
  manualPhysicalCash?: number | null;
  reason?: string | null;
  firstStart?: string | null;
  firstEnd?: string | null;
  secondStart?: string | null;
  secondEnd?: string | null;
}

/**
 * "Apertura del día" — always TODAY in America/Guatemala. The opening
 * physical cash is inherited from the last counted cut (never invented, never
 * reset to zero); only an admin may authorize a different amount, with a
 * mandatory reason. Idempotent: opening an already-open date returns it.
 * Both cuts are created PROGRAMADO with their scheduled times.
 */
@Injectable()
export class OpenCashDayUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
    private readonly getPosition: GetCashPositionUseCase,
  ) {}

  async execute(input: OpenCashDayInput): Promise<CashPositionOutput> {
    assertCutManager(input.role);
    const manual = input.manualPhysicalCash ?? null;
    if (manual !== null) {
      if (!isCashAdmin(input.role)) {
        throw cashControlError('CASH_MANUAL_OPENING_FORBIDDEN');
      }
      if (!Number.isFinite(manual) || manual < 0) {
        throw cashControlError('CASH_INVALID_AMOUNT');
      }
    }
    const times = [
      input.firstStart,
      input.firstEnd,
      input.secondStart,
      input.secondEnd,
    ];
    const hasSchedule = times.every((time) => isValidCutTime(time));
    if (hasSchedule) {
      assertCutSchedule(1, input.firstStart!, input.firstEnd!, {
        start: input.secondStart!,
        end: input.secondEnd!,
      });
      assertCutSchedule(2, input.secondStart!, input.secondEnd!);
    } else if (times.some((time) => time)) {
      throw cashControlError('CASH_CUT_INVALID_SCHEDULE');
    }
    const date = guatemalaIsoDate();
    await this.repository.openDay({
      date,
      userId: input.userId,
      manualPhysicalCash: manual,
      reason: manual !== null ? requireReason(input.reason) : null,
      firstStart: hasSchedule ? input.firstStart! : null,
      firstEnd: hasSchedule ? input.firstEnd! : null,
      secondStart: hasSchedule ? input.secondStart! : null,
      secondEnd: hasSchedule ? input.secondEnd! : null,
    });
    return this.getPosition.execute(date);
  }
}

/** "Programar horarios de corte" — records who changed it and why; finalized cuts are immutable. */
@Injectable()
export class UpdateCashCutScheduleUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
    private readonly getPosition: GetCashPositionUseCase,
  ) {}

  async execute(input: {
    periodId: string;
    start: string;
    end: string;
    reason: string;
    userId: string;
    role: string;
  }): Promise<CashPositionOutput> {
    assertCutManager(input.role);
    const period = await this.repository.findPeriodById(input.periodId);
    if (!period) {
      throw cashControlError('CASH_CUT_NOT_FOUND');
    }
    const siblings = await this.repository.findPeriodsByDay(
      period.operationalDayId,
    );
    const sibling = siblings.find((row) => row.id !== period.id);
    assertCutSchedule(
      period.periodNumber,
      input.start,
      input.end,
      sibling
        ? {
            start: guatemalaTime(sibling.scheduledStartAt),
            end: guatemalaTime(sibling.scheduledEndAt),
          }
        : null,
    );
    await this.repository.updateSchedule(
      input.periodId,
      input.start,
      input.end,
      requireReason(input.reason),
      input.userId,
    );
    return this.getPosition.execute(period.operationalDate);
  }
}

/**
 * "Iniciar primer/segundo corte". Validated under the lock in SQL: the day
 * is open, no other cut is open, the cut was not started yet and — for the
 * second — the first one is FINALIZADO. Takes the opening snapshot (system
 * cash, inherited physical cash, inherited difference, bank balances).
 */
@Injectable()
export class StartCashCutUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
    private readonly getPosition: GetCashPositionUseCase,
  ) {}

  async execute(input: {
    periodId: string;
    userId: string;
    role: string;
  }): Promise<CashPositionOutput> {
    assertCutManager(input.role);
    const period = await this.repository.findPeriodById(input.periodId);
    if (!period) {
      throw cashControlError('CASH_CUT_NOT_FOUND');
    }
    await this.repository.startPeriod(input.periodId, input.userId);
    return this.getPosition.execute(period.operationalDate);
  }
}

export interface FinishCashCutInput {
  periodId: string;
  userId: string;
  role: string;
  details: CashDenominationData[];
  banks: Array<
    Omit<CashBankVerificationData, 'observations'> & {
      observations?: string | null;
    }
  >;
  cashObservations?: string | null;
  observations?: string | null;
}

/**
 * "Finalizar primer/segundo corte" — arqueo by denomination (difference =
 * counted − system, computed in SQL) + verification of every active bank
 * account, saved as a permanent snapshot; the cut becomes FINALIZADO and
 * immutable for normal users. No movement is ever created to "fix" a difference.
 */
@Injectable()
export class FinishCashCutUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
    private readonly getPosition: GetCashPositionUseCase,
  ) {}

  async execute(input: FinishCashCutInput): Promise<CashPositionOutput> {
    assertCutManager(input.role);
    const period = await this.repository.findPeriodById(input.periodId);
    if (!period) {
      throw cashControlError('CASH_CUT_NOT_FOUND');
    }
    const seen = new Set<number>();
    for (const row of input.details) {
      const denomination = Math.round(row.denomination * 100) / 100;
      if (
        seen.has(denomination) ||
        !Number.isInteger(row.quantity) ||
        row.quantity < 0
      ) {
        throw cashControlError('CASH_INVALID_DENOMINATION');
      }
      seen.add(denomination);
    }
    await this.repository.finishPeriod({
      periodId: input.periodId,
      userId: input.userId,
      details: input.details.filter((row) => row.quantity > 0),
      banks: input.banks.map((bank) => ({
        bankId: bank.bankId,
        verifiedBalance: Math.round(bank.verifiedBalance * 100) / 100,
        observations: bank.observations?.trim() || null,
      })),
      cashObservations: input.cashObservations?.trim() || null,
      observations: input.observations?.trim() || null,
    });
    return this.getPosition.execute(period.operationalDate);
  }
}

/** Admin-only reopening of the LATEST finalized cut (reason mandatory; the previous arqueo stays in history). */
@Injectable()
export class ReopenCashCutUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
    private readonly getPosition: GetCashPositionUseCase,
  ) {}

  async execute(input: {
    periodId: string;
    reason: string;
    userId: string;
    role: string;
  }): Promise<CashPositionOutput> {
    if (!isCashAdmin(input.role)) {
      throw cashControlError('CASH_FORBIDDEN');
    }
    const period = await this.repository.findPeriodById(input.periodId);
    if (!period) {
      throw cashControlError('CASH_CUT_NOT_FOUND');
    }
    await this.repository.reopenPeriod(
      input.periodId,
      input.userId,
      requireReason(input.reason),
    );
    return this.getPosition.execute(period.operationalDate);
  }
}

/** "Cerrar día operativo" — only after both cuts are FINALIZADO; consolidates both without double counting. */
@Injectable()
export class CloseCashDayUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
    private readonly getPosition: GetCashPositionUseCase,
  ) {}

  async execute(input: {
    dayId: string;
    observations?: string | null;
    userId: string;
    role: string;
  }): Promise<CashPositionOutput> {
    assertCutManager(input.role);
    const day = await this.repository.findDayById(input.dayId);
    if (!day) {
      throw cashControlError('CASH_DAY_NOT_FOUND');
    }
    await this.repository.closeDay(
      input.dayId,
      input.userId,
      input.observations?.trim() || null,
    );
    return this.getPosition.execute(day.operationalDate);
  }
}
