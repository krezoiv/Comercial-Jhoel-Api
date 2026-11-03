import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import {
  GUAYACAN_COUNT_STATUS_LABEL,
  GuayacanCashCount,
  formatCurrency,
  formatQuantity,
} from '../../../../../core/models';
import { GuayacanCashBoxService } from '../../../../../core/services/guayacan-cash-box.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { GUAYACAN_DENOMINATIONS, formatDifference, formatGuatemalaDateTime } from '../../guayacan-cash.util';

/**
 * Detalle histórico de un arqueo (solo lectura): información general y las
 * 11 denominaciones exactamente como se guardaron. Lo abren Cajas y Cierres →
 * Arqueos — Guayacán y el propio Cuadre de Caja Guayacán. No se cierra con
 * clic fuera.
 */
@Component({
  selector: 'app-guayacan-count-detail-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './count-detail-modal.component.html',
  styleUrl: './count-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuayacanCountDetailModalComponent implements OnChanges {
  @Input() countId: string | null = null;
  @Output() closed = new EventEmitter<void>();

  private readonly service = inject(GuayacanCashBoxService);

  formatCurrency = formatCurrency;
  formatQuantity = formatQuantity;
  formatDateTime = formatGuatemalaDateTime;
  formatDifference = formatDifference;
  statusLabel = GUAYACAN_COUNT_STATUS_LABEL;

  readonly count = signal<GuayacanCashCount | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  /** Las 11 denominaciones en orden, con lo guardado (0 si la fila no existe). */
  readonly rows = computed(() => {
    const details = this.count()?.details ?? [];
    return GUAYACAN_DENOMINATIONS.map((denomination) => {
      const row = details.find((detail) => detail.denomination === denomination);
      return { denomination, quantity: row?.quantity ?? 0, subtotal: row?.subtotal ?? 0 };
    });
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countId'] && this.countId) {
      this.load(this.countId);
    }
  }

  private load(id: string): void {
    this.loading.set(true);
    this.count.set(null);
    this.errorMessage.set(null);
    this.service.getCount(id).subscribe({
      next: (count) => {
        this.count.set(count);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo cargar el arqueo.'));
      },
    });
  }

  formatDenomination(denomination: number): string {
    return `Q${denomination.toLocaleString('es-GT', { minimumFractionDigits: denomination < 1 ? 2 : 0 })}`;
  }
}
