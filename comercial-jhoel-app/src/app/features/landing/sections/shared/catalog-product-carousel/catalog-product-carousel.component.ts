import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PublicCatalogProduct } from '../../../../../core/models';
import { LandingCarouselComponent } from '../landing-carousel/landing-carousel.component';
import { CatalogProductCardComponent } from '../catalog-product-card/catalog-product-card.component';

/**
 * Carrusel compartido por "Librería" y "Variedades y Accesorios" — la
 * mecánica vive en `LandingCarouselComponent`; aquí solo se reenvían
 * `showInterestButton`/`enhancedEffects` a cada `CatalogProductCardComponent`
 * (la única diferencia real entre ambas secciones vive en esa card).
 */
@Component({
  selector: 'app-catalog-product-carousel',
  standalone: true,
  imports: [LandingCarouselComponent, CatalogProductCardComponent],
  templateUrl: './catalog-product-carousel.component.html',
  styleUrl: './catalog-product-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogProductCarouselComponent {
  @Input({ required: true }) products: PublicCatalogProduct[] = [];
  @Input() showInterestButton = false;
  @Input() ariaLabel = 'Catálogo de productos';
  /** Reenviado a cada `CatalogProductCardComponent` — ver el doc comment de ese `@Input`. */
  @Input() enhancedEffects = false;

  @Output() interest = new EventEmitter<PublicCatalogProduct>();
  @Output() imageZoom = new EventEmitter<{ url: string; alt: string }>();

  readonly productLabel = (product: PublicCatalogProduct): string => product.name;

  onInterest(product: PublicCatalogProduct): void {
    this.interest.emit(product);
  }

  onImageZoom(event: { url: string; alt: string }): void {
    this.imageZoom.emit(event);
  }
}
