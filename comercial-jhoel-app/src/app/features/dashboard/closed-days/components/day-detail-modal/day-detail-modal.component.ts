import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';

import {
  CLOSED_DAY_STATUS_LABEL,
  DAY_AUDIT_ACTION_LABEL,
  ClosedDayDetail,
  formatCurrency,
} from '../../../../../core/models';
import { ClosedDaysService } from '../../../../../core/services/closed-days.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const STATUS_ICON: Record<string, string> = {
  CLOSED: 'lock',
  REOPENED: 'alert-triangle',
  CANCELLED: 'x-circle',
};

/**
 * "Ver Detalle" de un día cerrado — pide `ClosedDaysService.getDayDetail`
 * cada vez que se abre (o cambia la fecha seleccionada), nunca cachea
 * entre aperturas: refleja siempre el estado más reciente, incluso si el
 * usuario acaba de reabrir/recerrar/anular el mismo día momentos antes.
 *
 * No muestra un desglose de denominaciones de efectivo — deliberado, ver
 * `ClosedDayDetail` (modelo): esta app nunca tuvo esa tabla, solo el
 * total.
 */
@Component({
  selector: 'app-day-detail-modal',
  standalone: true,
  imports: [DatePipe, ButtonComponent, IconComponent],
  templateUrl: './day-detail-modal.component.html',
  styleUrl: './day-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayDetailModalComponent implements OnChanges {
  private readonly closedDaysService = inject(ClosedDaysService);
  private readonly notificationService = inject(NotificationService);

  @Input() open = false;
  @Input() date: string | null = null;

  @Output() closed = new EventEmitter<void>();

  readonly detail = signal<ClosedDayDetail | null>(null);
  readonly loading = signal(false);

  readonly statusLabel = CLOSED_DAY_STATUS_LABEL;
  readonly auditActionLabel = DAY_AUDIT_ACTION_LABEL;
  readonly statusIcon = STATUS_ICON;
  formatCurrency = formatCurrency;

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['open'] || changes['date']) && this.open && this.date) {
      this.fetch(this.date);
    }
  }

  onClose(): void {
    this.closed.emit();
  }

  private fetch(date: string): void {
    this.loading.set(true);
    this.detail.set(null);
    this.closedDaysService.getDayDetail(date).subscribe({
      next: (detail) => {
        this.detail.set(detail);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cargar el detalle del día.'));
        this.closed.emit();
      },
    });
  }
}
