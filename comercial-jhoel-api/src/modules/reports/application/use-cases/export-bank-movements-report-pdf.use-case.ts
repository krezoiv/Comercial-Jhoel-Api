import { Inject, Injectable } from '@nestjs/common';
import { ListBankMovementsUseCase } from '../../../banks/application/use-cases/list-bank-movements.use-case';
import { BANK_REPOSITORY } from '../../../banks/domain/repositories/bank.repository';
import type { BankRepository } from '../../../banks/domain/repositories/bank.repository';
import type { BankMovementType } from '../../../banks/domain/entities/bank-account-movement.entity';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import { formatReportQuantity } from '../utils/report-format.util';
import {
  ReportPdfFilterLine,
  buildReportPdf,
} from '../../infrastructure/pdf/report-pdf.builder';

export interface ExportBankMovementsReportPdfInput {
  startDate?: string;
  endDate?: string;
  bankId?: string;
  movementType?: BankMovementType;
  userId?: string;
  generatedByUsername: string;
}

const EXPORT_ROW_LIMIT = 500;

export const BANK_MOVEMENT_TYPE_LABELS: Record<BankMovementType, string> = {
  DEPOSITO: 'Depósito',
  RETIRO: 'Retiro',
  DESEMBOLSO_GENESIS: 'Desembolso Génesis',
  PAGO_GENESIS: 'Pago Génesis',
  REINTEGRO: 'Reintegro',
  TRANSFERENCIA_SALIDA: 'Transferencia (salida)',
  TRANSFERENCIA_ENTRADA: 'Transferencia (entrada)',
  RETIRO_EFECTIVO: 'Retiro de efectivo',
  AJUSTE_MANUAL: 'Ajuste manual',
  SALDO_INICIAL: 'Saldo inicial',
  ANULACION: 'Anulación',
};

/** Conserva el signo real (−Q 5,000.00): un saldo negativo de Génesis nunca se muestra como positivo. */
function formatSignedCurrency(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-Q ${formatted}` : `Q ${formatted}`;
}

function formatIsoDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function formatPeriod(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) return 'Todas las fechas';
  if (startDate && endDate)
    return `${formatIsoDate(startDate)} - ${formatIsoDate(endDate)}`;
  if (startDate) return `Desde ${formatIsoDate(startDate)}`;
  return `Hasta ${formatIsoDate(endDate as string)}`;
}

/** Exportación PDF del historial de movimientos — reutiliza el mismo `buildReportPdf` de toda la Reportería. */
@Injectable()
export class ExportBankMovementsReportPdfUseCase {
  constructor(
    private readonly listBankMovementsUseCase: ListBankMovementsUseCase,
    @Inject(BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: ExportBankMovementsReportPdfInput): Promise<Buffer> {
    const [result, filterLines] = await Promise.all([
      this.listBankMovementsUseCase.execute({
        ...input,
        page: 1,
        limit: EXPORT_ROW_LIMIT,
      }),
      this.resolveFilterLines(input),
    ]);

    const applied = result.items.filter(
      (item) =>
        item.status === 'APLICADO' && item.movementType !== 'SALDO_INICIAL',
    );
    const totalIn = applied
      .filter((item) => item.amount > 0)
      .reduce((sum, item) => sum + item.amount, 0);
    const totalOut = applied
      .filter((item) => item.amount < 0)
      .reduce((sum, item) => sum + item.amount, 0);

    const rows = result.items.map((item) => [
      formatIsoDate(item.businessDate),
      `${item.bankName} · ${item.accountNumber}`,
      BANK_MOVEMENT_TYPE_LABELS[item.movementType] +
        (item.status === 'ANULADO' ? ' (anulado)' : ''),
      formatSignedCurrency(item.amount),
      formatSignedCurrency(item.balanceBefore),
      formatSignedCurrency(item.balanceAfter),
      item.username,
    ]);

    return buildReportPdf({
      reportTitle: 'MOVIMIENTOS BANCARIOS',
      periodLabel: formatPeriod(input.startDate, input.endDate),
      filters: filterLines,
      summary: [
        { label: 'Movimientos', value: formatReportQuantity(result.total) },
        { label: 'Aumentos', value: formatSignedCurrency(totalIn) },
        { label: 'Disminuciones', value: formatSignedCurrency(totalOut) },
      ],
      columns: [
        { header: 'Fecha', width: 56 },
        { header: 'Cuenta', width: 110 },
        { header: 'Tipo', width: 80 },
        { header: 'Monto', width: 68, align: 'right' },
        { header: 'Saldo anterior', width: 70, align: 'right' },
        { header: 'Saldo posterior', width: 70, align: 'right' },
        { header: 'Usuario', width: 61 },
      ],
      rows,
      generatedAt: new Date(),
      generatedByUsername: input.generatedByUsername,
      truncationNotice:
        result.total > EXPORT_ROW_LIMIT
          ? `Se muestran los primeros ${EXPORT_ROW_LIMIT} de ${result.total} movimientos. Aplica un rango de fechas más específico para exportar el detalle completo.`
          : undefined,
    });
  }

  private async resolveFilterLines(
    input: ExportBankMovementsReportPdfInput,
  ): Promise<ReportPdfFilterLine[]> {
    const lines: ReportPdfFilterLine[] = [];
    if (input.bankId) {
      const bank = await this.bankRepository.findById(input.bankId);
      lines.push({
        label: 'Cuenta',
        value: bank ? `${bank.name} · ${bank.accountNumber}` : '—',
      });
    }
    if (input.movementType) {
      lines.push({
        label: 'Tipo',
        value: BANK_MOVEMENT_TYPE_LABELS[input.movementType],
      });
    }
    if (input.userId) {
      const user = await this.userRepository.findById(input.userId);
      lines.push({
        label: 'Usuario',
        value: user?.username ?? user?.name ?? '—',
      });
    }
    return lines;
  }
}
