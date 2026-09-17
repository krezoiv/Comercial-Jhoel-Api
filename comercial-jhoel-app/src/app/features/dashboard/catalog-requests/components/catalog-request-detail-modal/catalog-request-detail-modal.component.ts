import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CATALOG_REQUEST_STATUS_LABEL,
  CATALOG_REQUEST_TYPE_LABEL,
  CatalogRequest,
  CatalogRequestStatus,
} from '../../../../../core/models';
import { CatalogRequestService } from '../../../../../core/services/catalog-request.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const STATUS_OPTIONS: CatalogRequestStatus[] = ['NUEVA', 'CONTACTADA', 'EN_PROCESO', 'ATENDIDA', 'CANCELADA'];

/** Igual convención que `ContactService`'s propio `digitsOnly` — un enlace `wa.me`/`tel:` necesita un string numérico limpio. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

@Component({
  selector: 'app-catalog-request-detail-modal',
  standalone: true,
  imports: [DatePipe, FormsModule, ButtonComponent, IconComponent],
  templateUrl: './catalog-request-detail-modal.component.html',
  styleUrl: './catalog-request-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogRequestDetailModalComponent implements OnChanges {
  @Input() request: CatalogRequest | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() updated = new EventEmitter<CatalogRequest>();

  private readonly catalogRequestService = inject(CatalogRequestService);
  private readonly notificationService = inject(NotificationService);

  readonly statusLabel = CATALOG_REQUEST_STATUS_LABEL;
  readonly typeLabel = CATALOG_REQUEST_TYPE_LABEL;
  readonly statusOptions = STATUS_OPTIONS;

  readonly draftStatus = signal<CatalogRequestStatus>('NUEVA');
  readonly draftObservation = signal('');
  readonly isSaving = signal(false);

  get open(): boolean {
    return this.request !== null;
  }

  get whatsappHref(): string | null {
    const phone = this.request?.customerPhone;
    if (!phone) {
      return null;
    }
    const digits = digitsOnly(phone);
    return digits ? `https://wa.me/${digits}` : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['request'] || !this.request) {
      return;
    }
    this.draftStatus.set(this.request.status);
    this.draftObservation.set(this.request.observation ?? '');
  }

  save(): void {
    const request = this.request;
    if (!request || this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.catalogRequestService
      .updateStatus(request.id, {
        status: this.draftStatus(),
        observation: this.draftObservation().trim() || null,
      })
      .subscribe({
        next: (updated) => {
          this.isSaving.set(false);
          this.notificationService.success('Solicitud actualizada correctamente.');
          this.updated.emit(updated);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar la solicitud.'));
        },
      });
  }

  close(): void {
    this.closed.emit();
  }
}
