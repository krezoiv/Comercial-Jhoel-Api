import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { PublicCatalogProduct } from '../../../../core/models';
import { PublicProductCatalogService } from '../../../../core/services/public-product-catalog.service';
import { RevealOnScrollDirective } from '../../../../shared/directives/reveal-on-scroll.directive';
import { SectionComponent, SectionHeadingComponent } from '../../../../shared/ui';
import { CatalogProductCardComponent } from '../shared/catalog-product-card/catalog-product-card.component';

/**
 * Sección "LIBRERÍA" de la landing pública — catálogo puramente informativo
 * (sin "Lo quiero", sin WhatsApp, sin crédito). Si no hay productos
 * publicados, la sección simplemente no se renderiza — nunca datos de
 * ejemplo hardcodeados.
 */
@Component({
  selector: 'app-library-catalog',
  standalone: true,
  imports: [SectionComponent, SectionHeadingComponent, RevealOnScrollDirective, CatalogProductCardComponent],
  templateUrl: './library-catalog.component.html',
  styleUrl: './library-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryCatalogComponent {
  private readonly publicProductCatalogService = inject(PublicProductCatalogService);

  readonly products = signal<PublicCatalogProduct[]>([]);
  readonly loading = signal(true);

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
}
