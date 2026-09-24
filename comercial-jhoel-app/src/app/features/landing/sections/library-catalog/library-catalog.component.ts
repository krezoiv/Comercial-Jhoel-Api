import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { PublicCatalogProduct } from '../../../../core/models';
import { PublicProductCatalogService } from '../../../../core/services/public-product-catalog.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { ParallaxLayerDirective } from '../../../../shared/directives/parallax-layer.directive';
import { SectionLandingBackgroundComponent } from '../shared/section-landing-background/section-landing-background.component';
import { ImageLightboxComponent, SectionComponent, SectionHeadingComponent } from '../../../../shared/ui';
import { CatalogProductCarouselComponent } from '../shared/catalog-product-carousel/catalog-product-carousel.component';

/**
 * Sección "LIBRERÍA" de la landing pública — catálogo puramente informativo
 * (sin "Lo quiero", sin WhatsApp, sin crédito). Si no hay productos
 * publicados, la sección simplemente no se renderiza — nunca datos de
 * ejemplo hardcodeados.
 */
@Component({
  selector: 'app-library-catalog',
  standalone: true,
  imports: [
    SectionComponent,
    SectionHeadingComponent,
    RevealOnScrollDirective,
    ParallaxLayerDirective,
    SectionLandingBackgroundComponent,
    CatalogProductCarouselComponent,
    ImageLightboxComponent,
  ],
  templateUrl: './library-catalog.component.html',
  styleUrl: './library-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryCatalogComponent {
  private readonly publicProductCatalogService = inject(PublicProductCatalogService);

  readonly products = signal<PublicCatalogProduct[]>([]);
  readonly loading = signal(true);

  readonly zoomedImageUrl = signal<string | null>(null);
  readonly zoomedImageAlt = signal('');

  constructor() {
    this.publicProductCatalogService.getPublishedProducts('LIBRERIA').subscribe({
      next: (products) => {
        this.products.set(products);
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
