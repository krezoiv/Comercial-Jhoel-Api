import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { PublicCatalogBank } from '../../../../core/models';
import { PublicCatalogBankService } from '../../../../core/services/public-catalog-bank.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { ParallaxLayerDirective } from '../../../../shared/directives/parallax-layer.directive';
import { ImageLightboxComponent, SectionHeadingComponent } from '../../../../shared/ui';
import { BankCarouselComponent } from './components/bank-carousel/bank-carousel.component';

/**
 * Fragmento "Bancos con los que trabajamos" — catálogo informativo con
 * flip 3D (imagen + nombre al frente, descripción + información adicional
 * al reverso). Completamente independiente del módulo financiero de
 * Bancos (Agentes Bancarios/Cuadre).
 *
 * Deliberadamente SIN su propio `<app-section>`/anchor: se fusionó dentro
 * de `BankAgentsComponent` (una sola sección pública "Agentes Bancarios",
 * un solo destino de navegación) — este componente ahora solo aporta el
 * fragmento visual (glow + encabezado + carousel + lightbox), montado
 * como hijo de la sección que si lo envuelve. Si no hay bancos
 * publicados, no renderiza nada.
 */
@Component({
  selector: 'app-catalog-banks',
  standalone: true,
  imports: [SectionHeadingComponent, RevealOnScrollDirective, ParallaxLayerDirective, BankCarouselComponent, ImageLightboxComponent],
  templateUrl: './catalog-banks.component.html',
  styleUrl: './catalog-banks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogBanksComponent {
  private readonly publicCatalogBankService = inject(PublicCatalogBankService);

  readonly banks = signal<PublicCatalogBank[]>([]);
  readonly loading = signal(true);

  readonly zoomedImageUrl = signal<string | null>(null);
  readonly zoomedImageAlt = signal('');

  constructor() {
    this.publicCatalogBankService.getPublishedBanks().subscribe({
      next: (banks) => {
        this.banks.set(banks);
        this.loading.set(false);
      },
      error: (_error: HttpErrorResponse) => {
        // Sección opcional de la landing — un fallo de red aquí no debe romper el resto de la página, solo se oculta.
        this.loading.set(false);
      },
    });
  }

  onImageZoom(event: { url: string; alt: string }): void {
    this.zoomedImageUrl.set(event.url);
    this.zoomedImageAlt.set(event.alt);
  }

  closeImageLightbox(): void {
    this.zoomedImageUrl.set(null);
  }
}
