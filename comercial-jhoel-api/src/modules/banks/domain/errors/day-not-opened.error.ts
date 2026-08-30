import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * "El usuario NO debe poder acceder libremente... hasta que se complete
 * correctamente la secuencia: aperturar día → registrar saldos → guardar
 * → confirmar." Este error cubre las dos mitades de esa secuencia que
 * dependen de haber aperturado primero: guardar saldos bancarios de HOY
 * (`SaveBankBalancesUseCase`) y guardar un cuadre de agentes
 * (`CloseAgentDayUseCase`). Nunca se lanza para una fecha
 * pasada — esas correcciones históricas son una funcionalidad ya
 * existente que este ticket pide preservar sin cambios.
 */
export class DayNotOpenedError extends DomainError {
  readonly status = 400;

  constructor(date: string, action: 'balances' | 'reconciliation' = 'balances') {
    super(
      action === 'reconciliation'
        ? `Debe aperturar el día y guardar los saldos bancarios correspondientes antes de realizar el cuadre de agentes.`
        : `Debe aperturar el día ${date} antes de registrar los saldos bancarios.`,
    );
  }
}
