import { DomainError } from '../../../../shared/domain/domain-error';

const MESSAGES: Record<string, { message: string; status: number }> = {
  CUADRE_CASH_BREAKDOWN_INVALID: {
    message:
      'El desglose de efectivo no es válido: use solo denominaciones de Q200 a Q0.01, cantidades enteras no negativas y una fila por denominación.',
    status: 400,
  },
  CUADRE_CASH_BREAKDOWN_MISMATCH: {
    message:
      'El total de efectivo no coincide con la suma del desglose de denominaciones.',
    status: 400,
  },
  CUADRE_SOURCE_COUNT_INVALID: {
    message:
      'El arqueo de Caja cargado ya no es válido (fue reemplazado o no existe). Vuelva a cargar el último arqueo o ingrese el conteo manualmente.',
    status: 409,
  },
  CUADRE_SOURCE_COUNT_FORBIDDEN: {
    message: 'No tiene permiso para usar arqueos de Caja en el cuadre.',
    status: 403,
  },
};

/**
 * Rejected cash breakdown of a Cuadre de Agentes (the SQL function
 * `close_agent_day_with_cash_breakdown` raises the same codes).
 */
export class CuadreCashBreakdownError extends DomainError {
  readonly status: number;

  constructor(readonly code: keyof typeof MESSAGES | string) {
    const entry = MESSAGES[code] ?? MESSAGES.CUADRE_CASH_BREAKDOWN_INVALID;
    super(entry.message);
    this.status = entry.status;
  }

  /** Maps a `RAISE EXCEPTION 'CUADRE_…:detail'` message, or null if it is not one. */
  static fromMessage(message: string): CuadreCashBreakdownError | null {
    const code = Object.keys(MESSAGES).find((key) =>
      message.includes(`${key}:`),
    );
    if (code) {
      return new CuadreCashBreakdownError(code);
    }
    // The source arqueo is checked with the cash-custody role rule in SQL.
    if (message.includes('CASH_CUSTODY_FORBIDDEN:')) {
      return new CuadreCashBreakdownError('CUADRE_SOURCE_COUNT_FORBIDDEN');
    }
    return null;
  }
}
