import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { NewsSubscriberDetail } from '../../../../../core/models';
import { BadgeComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';

const ACTION_LABELS: Record<string, string> = {
  SUBSCRIBED: 'Se suscribió',
  PREFERENCES_UPDATED: 'Actualizó sus preferencias',
  UNSUBSCRIBED: 'Se desuscribió',
  REACTIVATED: 'Reactivó su suscripción',
  ADMIN_ACTIVATED: 'Activado por un administrador',
  ADMIN_DEACTIVATED: 'Desactivado por un administrador',
};

/** Detalle de un suscriptor + su historial de consentimiento/preferencias (punto 13 del pedido). Solo lectura — activar/desactivar vive en la tabla. */
@Component({
  selector: 'app-news-subscriber-detail-modal',
  standalone: true,
  imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent],
  templateUrl: './news-subscriber-detail-modal.component.html',
  styleUrl: './news-subscriber-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsSubscriberDetailModalComponent {
  @Input() subscriber: NewsSubscriberDetail | null = null;

  @Output() closed = new EventEmitter<void>();

  get open(): boolean {
    return this.subscriber !== null;
  }

  actionLabel(action: string): string {
    return ACTION_LABELS[action] ?? action;
  }

  close(): void {
    this.closed.emit();
  }
}
