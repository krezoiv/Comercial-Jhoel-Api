import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { PublicCatalogProduct } from '../../../../core/models';
import { PublicProductCatalogService } from '../../../../core/services/public-product-catalog.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { ImageLightboxComponent, SectionComponent, SectionHeadingComponent } from '../../../../shared/ui';
import { CatalogProductCardComponent } from '../shared/catalog-product-card/catalog-product-card.component';
import { ProductInterestModalComponent } from './components/product-interest-modal/product-interest-modal.component';

/**
 * Sección "VARIEDADES Y ACCESORIOS" de la landing pública — catálogo con
 * captura de interés ("Lo quiero" → WhatsApp, mismo mecanismo ya usado por
 * Teléfonos). Deliberadamente sin nada de Krediya/crédito — exclusivo de
 * Teléfonos. Si no hay productos publicados, la sección no se renderiza.
 */
@Component({
  selector: 'app-varieties-catalog',
  standalone: true,
  imports: [
    SectionComponent,
    SectionHeadingComponent,
    RevealOnScrollDirective,
    CatalogProductCardComponent,
    ProductInterestModalComponent,
    ImageLightboxComponent,
  ],
  templateUrl: './varieties-catalog.component.html',
  styleUrl: './varieties-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VarietiesCatalogComponent {
  private readonly publicProductCatalogService = inject(PublicProductCatalogService);

  readonly products = signal<PublicCatalogProduct[]>([]);
  readonly loading = signal(true);

  readonly selectedProduct = signal<PublicCatalogProduct | null>(null);

  readonly zoomedImageUrl = signal<string | null>(null);
  readonly zoomedImageAlt = signal('');

  constructor() {
    this.publicProductCatalogService.getPublishedProducts('VARIEDADES_ACCESORIOS').subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (_error: HttpErrorResponse) => {
        this.loading.set(false);
      },
    });
  }

  onRequestInterest(product: PublicCatalogProduct): void {
    this.selectedProduct.set(product);
  }

  closeInterestModal(): void {
    this.selectedProduct.set(null);
  }

  onImageZoom(event: { url: string; alt: string }): void {
    this.zoomedImageUrl.set(event.url);
    this.zoomedImageAlt.set(event.alt);
  }

  closeImageLightbox(): void {
    this.zoomedImageUrl.set(null);
  }
}
