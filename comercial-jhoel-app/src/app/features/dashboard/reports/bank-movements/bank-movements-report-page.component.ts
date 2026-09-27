import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  BANK_MOVEMENT_ORIGIN_LABELS,
  BANK_MOVEMENT_TYPE_LABELS,
  Bank,
  BankMovement,
  BankMovementType,
  BankMovementsFilters,
  User,
  bankAccountLabel,
  formatQuantity,
} from '../../../../core/models';
import { BankService } from '../../../../core/services/bank.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportsService } from '../../../../core/services/reports.service';
import { UserService } from '../../../../core/services/user.service';
import { formatSignedBankBalance } from '../../../../core/utils/bank-balance.util';
import { downloadBlob } from '../../../../core/utils/download-blob';
import { extractBlobErrorMessage } from '../../../../core/utils/extract-blob-error-message';
import { extractErrorMessage } from '../../../../core/utils/extract-error-message';
import { BankBalanceAmountComponent, ButtonComponent, IconComponent, PageHeaderComponent } from '../../../../shared/ui';
import { ReportPaginationComponent } from '../components/report-pagination/report-pagination.component';

function todayIsoDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function firstDayOfMonthIsoDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

const LIMIT = 25;

/**
 * Reportería → Movimientos Bancarios (admin). El historial completo del
 * ledger de saldos: cada depósito, retiro, desembolso/pago Génesis,
 * reintegro, transferencia, ajuste manual y anulación, con saldo anterior y
 * posterior. Nada se calcula aquí — todo viene del backend. Mismo layout
 * (filtros aplicados vs. borrador, paginación, PDF) que el Reporte de
 * Transacciones.
 */
@Component({
  selector: 'app-bank-movements-report-page',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    BankBalanceAmountComponent,
    ReportPaginationComponent,
  ],
  templateUrl: './bank-movements-report-page.component.html',
  styleUrls: ['../bank-deposits/bank-deposits-report-page.component.scss', './bank-movements-report-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankMovementsReportPageComponent {
  private readonly reportsService = inject(ReportsService);
  private readonly bankService = inject(BankService);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  readonly limit = LIMIT;
  readonly movementTypes = Object.entries(BANK_MOVEMENT_TYPE_LABELS) as [BankMovementType, string][];
  readonly typeLabels = BANK_MOVEMENT_TYPE_LABELS;
  readonly originLabels = BANK_MOVEMENT_ORIGIN_LABELS;
  readonly accountLabel = bankAccountLabel;
  readonly formatQuantity = formatQuantity;

  readonly accounts = signal<Bank[]>([]);
  readonly users = signal<User[]>([]);

  readonly draftStartDate = signal(firstDayOfMonthIsoDate());
  readonly draftEndDate = signal(todayIsoDate());
  readonly draftBankId = signal('');
  readonly draftMovementType = signal('');
  readonly draftUserId = signal('');

  private readonly applied = signal<BankMovementsFilters>({
    startDate: firstDayOfMonthIsoDate(),
    endDate: todayIsoDate(),
  });
  readonly page = signal(1);

  readonly rows = signal<BankMovement[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly exporting = signal(false);

  readonly hasActiveFilters = computed(() => {
    const filters = this.applied();
    return (
      !!filters.bankId ||
      !!filters.movementType ||
      !!filters.userId ||
      filters.startDate !== firstDayOfMonthIsoDate() ||
      filters.endDate !== todayIsoDate()
    );
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
    this.fetch();
  }

  signedAmount(value: number): string {
    return value > 0 ? `+${formatSignedBankBalance(value)}` : formatSignedBankBalance(value);
  }

  applyFilters(): void {
    if (this.draftStartDate() && this.draftEndDate() && this.draftStartDate() > this.draftEndDate()) {
      this.notificationService.error('La fecha de inicio debe ser anterior o igual a la fecha final.');
      return;
    }
    this.applied.set({
      startDate: this.draftStartDate() || undefined,
      endDate: this.draftEndDate() || undefined,
      bankId: this.draftBankId() || undefined,
      movementType: (this.draftMovementType() || undefined) as BankMovementType | undefined,
      userId: this.draftUserId() || undefined,
    });
    this.page.set(1);
    this.fetch();
  }

  clearFilters(): void {
    this.draftStartDate.set(firstDayOfMonthIsoDate());
    this.draftEndDate.set(todayIsoDate());
    this.draftBankId.set('');
    this.draftMovementType.set('');
    this.draftUserId.set('');
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetch();
  }

  exportPdf(): void {
    if (this.exporting()) {
      return;
    }
    this.exporting.set(true);
    this.reportsService.exportBankMovementsReportPdf(this.applied()).subscribe({
      next: (blob) => {
        this.exporting.set(false);
        downloadBlob(blob, `movimientos-bancarios-${todayIsoDate()}.pdf`);
        this.notificationService.success('El PDF se generó correctamente.');
      },
      error: async (error: HttpErrorResponse) => {
        this.exporting.set(false);
        this.notificationService.error(await extractBlobErrorMessage(error, 'No se pudo exportar el reporte.'));
      },
    });
  }

  private fetch(): void {
    this.loading.set(true);
    this.reportsService.getBankMovementsReport({ ...this.applied(), page: this.page(), limit: LIMIT }).subscribe({
      next: (result) => {
        this.rows.set(result.items);
        this.total.set(result.total);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar los movimientos.'));
      },
    });
  }
}
