import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { LandingBackground } from '../../../../../core/models';
import { LandingBackgroundService } from '../../../../../core/services/landing-background.service';
import { ButtonComponent, IconComponent, LandingBackgroundLayerComponent } from '../../../../../shared/ui';

/**
 * "Vista previa" desde la tabla — monta la MISMA `LandingBackgroundLayerComponent`
 * que se renderiza en la landing pública (nunca una reconstrucción aparte),
 * sobre contenido de ejemplo, con la configuración YA GUARDADA del fondo
 * (a diferencia del panel de vista previa dentro del formulario, que
 * refleja el borrador en edición).
 */
@Component({
  selector: 'app-background-preview-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent, LandingBackgroundLayerComponent],
  templateUrl: './background-preview-modal.component.html',
  styleUrl: './background-preview-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundPreviewModalComponent {
  @Input() background: LandingBackground | null = null;

  @Output() closed = new EventEmitter<void>();

  private readonly landingBackgroundService = inject(LandingBackgroundService);

  get open(): boolean {
    return this.background !== null;
  }

  get imageUrl(): string | null {
    return this.background?.hasImage ? this.landingBackgroundService.getImageUrl(this.background.id) : null;
  }

  close(): void {
    this.closed.emit();
  }
}
