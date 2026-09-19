import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AppUpdateService } from '../../../core/services/app-update.service';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

/**
 * Mostrado solo cuando `AppUpdateService` detectó una versión nueva PERO no
 * pudo activarla sola porque hay un borrador con datos sin guardar (Ventas,
 * Compras, Transaccionar, Cuadre de Bancos, Heladería) — en cualquier otro
 * caso (landing pública, dashboard sin operación en curso) la actualización
 * ya ocurrió sin que el usuario tuviera que hacer nada, y este banner nunca
 * llega a aparecer. Montado una sola vez en `AppComponent`, igual que
 * `ToastContainerComponent`.
 */
@Component({
  selector: 'app-update-available-banner',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './update-available-banner.component.html',
  styleUrl: './update-available-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAvailableBannerComponent {
  private readonly appUpdateService = inject(AppUpdateService);

  readonly visible = computed(() => this.appUpdateService.updateReady() && !this.appUpdateService.dismissed());

  updateNow(): void {
    void this.appUpdateService.applyUpdate();
  }

  dismiss(): void {
    this.appUpdateService.dismiss();
  }
}
