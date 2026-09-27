import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Bank,
  BankTransfer,
  BankTransfersReportFilters,
  BankTransfersSummary,
  User,
  bankAccountLabel,
  formatQuantity,
} from '../../../../core/models';
import { BankService } from '../../../../core/services/bank.service';
import { BankTransferService } from '../../../../core/services/bank-transfer.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportsService } from '../../../../core/services/reports.service';
import { UserService } from '../../../../core/services/user.service';
import { formatSignedBankBalance } from '../../../../core/utils/bank-balance.util';
import { downloadBlob } from '../../../../core/utils/download-blob';
import { extractBlobErrorMessage } from '../../../../core/utils/extract-blob-error-message';
import { extractErrorMessage } from '../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent, PageHeaderComponent } from '../../../../shared/ui';
import { ReportPaginationComponent } from '../components/report-pagination/report-pagination.component';
import { ReportSummaryComponent, ReportSummaryTile } from '../components/report-summary/report-summary.component';
import { VoidConfirmModalComponent } from '../bank-deposits/components/void-confirm-modal/void-confirm-modal.component';

function todayIsoDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function firstDayOfMonthIsoDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

const LIMIT = 20;

/**
 * Reportería → Reporte de Transferencias (admin). Mismo patrón que el
 * Reporte de Transacciones: filtros en borrador que solo se aplican con
 * "Aplicar filtros" (así el PDF siempre coincide con lo que se ve), resumen
 * en tarjetas, tabla paginada, desglose por ruta origen → destino y
 * anulación (movimientos inversos, nunca borrado). Todo el cálculo vive en
 * el backend.
 */
@Component({
  selector: 'app-bank-transfers-report-page',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    ReportSummaryComponent,
    ReportPaginationComponent,
    VoidConfirmModalComponent,
  ],
  templateUrl: './bank-transfers-report-page.component.html',
  styleUrls: ['../bank-deposits/bank-deposits-report-page.component.scss', './bank-transfers-report-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankTransfersReportPageComponent {
  private readonly reportsService = inject(ReportsService);
  private readonly bankService = inject(BankService);
  private readonly bankTransferService = inject(BankTransferService);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  readonly limit = LIMIT;
  readonly accountLabel = bankAccountLabel;
  readonly formatSigned = formatSignedBankBalance;
  readonly formatQuantity = formatQuantity;

  readonly accounts = signal<Bank[]>([]);
  readonly users = signal<User[]>([]);

  readonly draftStartDate = signal(firstDayOfMonthIsoDate());
  readonly draftEndDate = signal(todayIsoDate());
  readonly draftSourceBankId = signal('');
  readonly draftDestinationBankId = signal('');
  readonly draftUserId = signal('');
  readonly draftStatus = signal('');

  private readonly applied = signal<BankTransfersReportFilters>({
    startDate: firstDayOfMonthIsoDate(),
    endDate: todayIsoDate(),
  });
  readonly page = signal(1);

  readonly rows = signal<BankTransfer[]>([]);
  readonly total = signal(0);
  readonly summary = signal<BankTransfersSummary | null>(null);
  readonly loadingTable = signal(false);
  readonly loadingSummary = signal(false);
  readonly exporting = signal(false);

  readonly voidingTransferId = signal<string | null>(null);
  readonly isVoiding = signal(false);

  readonly hasActiveFilters = computed(() => {
    const f = this.applied();
    return (
      !!f.sourceBankId ||
      !!f.destinationBankId ||
      !!f.userId ||
      !!f.status ||
      f.startDate !== firstDayOfMonthIsoDate() ||
      f.endDate !== todayIsoDate()
    );
  });

  readonly summaryTiles = computed<ReportSummaryTile[]>(() => {
    const s = this.summary();
    const averageAmount = s && s.transferCount > 0 ? s.totalAmount / s.transferCount : 0;
    return [
      {
        icon: 'arrow-left-right',
        title: 'Transferencias',
        value: formatQuantity(s?.transferCount ?? 0),
        description: 'aplicadas en el período',
      },
      {
        icon: 'trending-up',
        title: 'Monto transferido',
        value: formatSignedBankBalance(s?.totalAmount ?? 0),
        description: 'sin contar anuladas',
      },
      {
        icon: 'bar-chart',
        title: 'Promedio',
        value: formatSignedBankBalance(averageAmount),
        description: 'por transferencia',
      },
      {
        icon: 'x-circle',
        title: 'Anuladas',
        value: formatQuantity(s?.voidedCount ?? 0),
        description: `${formatSignedBankBalance(s?.voidedAmount ?? 0)} revertidos`,
      },
    ];
  });

  constructor() {
    this.bankService.getBanks(true).subscribe({
      next: (banks) => this.accounts.set(banks),
      error: () => this.notificationService.error('No se pudieron cargar las cuentas bancarias.'),
    });
    this.userService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: () => this.notificationService.error('No se pudieron cargar los usuarios.'),
    });
    this.fetchAll();
  }

  applyFilters(): void {
    if (this.draftStartDate() && this.draftEndDate() && this.draftStartDate() > this.draftEndDate()) {
      this.notificationService.error('La fecha de inicio debe ser anterior o igual a la fecha final.');
      return;
    }
    this.applied.set({
      startDate: this.draftStartDate() || undefined,
      endDate: this.draftEndDate() || undefined,
      sourceBankId: this.draftSourceBankId() || undefined,
      destinationBankId: this.draftDestinationBankId() || undefined,
      userId: this.draftUserId() || undefined,
      status: (this.draftStatus() || undefined) as BankTransfersReportFilters['status'],
    });
    this.page.set(1);
    this.fetchAll();
  }

  clearFilters(): void {
    this.draftStartDate.set(firstDayOfMonthIsoDate());
    this.draftEndDate.set(todayIsoDate());
    this.draftSourceBankId.set('');
    this.draftDestinationBankId.set('');
    this.draftUserId.set('');
    this.draftStatus.set('');
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetchTable();
  }

  /** Exporta exactamente los filtros aplicados (nunca el borrador), igual que el resto de la Reportería. */
  exportPdf(): void {
    if (this.exporting()) {
      return;
    }
    this.exporting.set(true);
    this.reportsService.exportBankTransfersReportPdf(this.applied()).subscribe({
      next: (blob) => {
        this.exporting.set(false);
        downloadBlob(blob, `reporte-transferencias-${todayIsoDate()}.pdf`);
        this.notificationService.success('El PDF se generó correctamente.');
      },
      error: async (error: HttpErrorResponse) => {
        this.exporting.set(false);
        this.notificationService.error(await extractBlobErrorMessage(error, 'No se pudo exportar el reporte.'));
      },
    });
  }

  openVoid(transfer: BankTransfer): void {
    if (transfer.status === 'ANULADO') {
      return;
    }
    this.voidingTransferId.set(transfer.id);
  }

  cancelVoid(): void {
    if (this.isVoiding()) {
      return;
    }
    this.voidingTransferId.set(null);
  }

  confirmVoid(reason: string): void {
    const id = this.voidingTransferId();
    if (!id || this.isVoiding()) {
      return;
    }
    this.isVoiding.set(true);
    this.bankTransferService.voidTransfer(id, reason).subscribe({
      next: () => {
        this.isVoiding.set(false);
        this.voidingTransferId.set(null);
        this.notificationService.success('La transferencia fue anulada; los saldos se revirtieron con movimientos inversos.');
        this.fetchAll();
      },
      error: (error: HttpErrorResponse) => {
        this.isVoiding.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo anular la transferencia.'));
      },
    });
  }

  private fetchAll(): void {
    this.loadingSummary.set(true);
    this.reportsService.getBankTransfersReportSummary(this.applied()).subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loadingSummary.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loadingSummary.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cargar el resumen.'));
      },
    });
    this.fetchTable();
  }

  private fetchTable(): void {
    this.loadingTable.set(true);
    this.reportsService.getBankTransfersReport({ ...this.applied(), page: this.page(), limit: LIMIT }).subscribe({
      next: (result) => {
        this.rows.set(result.items);
        this.total.set(result.total);
        this.loadingTable.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loadingTable.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar las transferencias.'));
      },
    });
  }
}
