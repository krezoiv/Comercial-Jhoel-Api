import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { PublicLandingBackgroundService } from '../../../../../core/services/public-landing-background.service';
import { LandingBackgroundLayerComponent } from '../../../../../shared/ui';

/**
 * Une cada sección real de la landing con la capa de fondo administrable —
 * una sola línea por sección (`<app-section-landing-background
 * sectionKey="telefonos" />`, primer hijo dentro de la sección) en vez de
 * repetir la inyección/búsqueda en las 9 secciones. `PublicLandingBackgroundService`
 * cachea la petición (`shareReplay(1)`), así que montar esto en las 9
 * secciones nunca dispara 9 peticiones HTTP, solo una compartida.
 * Renderiza `LandingBackgroundLayerComponent` — el mismo componente que la
 * vista previa del admin — nunca una implementación aparte.
 */
@Component({
  selector: 'app-section-landing-background',
  standalone: true,
  imports: [LandingBackgroundLayerComponent],
  template: `
    @if (background(); as bg) {
      <app-landing-background-layer
        [imageUrl]="bg.hasImage ? imageUrl(bg.id) : null"
        [opacity]="bg.opacity"
        [overlay]="bg.overlay"
        [position]="bg.position"
        [size]="bg.size"
        [depthEffect]="bg.depthEffect"
        [parallax]="bg.parallax"
        [movement]="bg.movement"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionLandingBackgroundComponent {
  readonly sectionKey = input.required<string>();

  private readonly service = inject(PublicLandingBackgroundService);

  private readonly backgrounds = toSignal(
    this.service.getPublishedBackgrounds().pipe(catchError(() => of([]))),
    { initialValue: [] },
  );

  readonly background = computed(
    () => this.backgrounds().find((b) => b.sectionKey === this.sectionKey()) ?? null,
  );

  imageUrl(id: string): string {
    return this.service.getImageUrl(id);
  }
}
