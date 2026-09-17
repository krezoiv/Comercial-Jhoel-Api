import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';

import { PublicCatalogProduct } from '../../../../../core/models';
import { PublicProductCatalogService } from '../../../../../core/services/public-product-catalog.service';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Card compartida por "Librería" y "Variedades y Accesorios" — mismo flip
 * 3D CSS que `PhoneCardComponent` (frente/reverso, `preserve-3d`/`rotateY`),
 * pero sin badges de crédito y con `showInterestButton` controlando si
 * aparece "Lo quiero" — la única diferencia de negocio entre ambas
 * secciones vive en este único `@Input`, nunca en una copia duplicada del
 * componente.
 */
@Component({
  selector: 'app-catalog-product-card',
  standalone: true,
  imports: [DecimalPipe, ButtonComponent, IconComponent],
  templateUrl: './catalog-product-card.component.html',
  styleUrl: './catalog-product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogProductCardComponent {
  @Input({ required: true }) product!: PublicCatalogProduct;
  @Input() showInterestButton = false;

  @Output() interest = new EventEmitter<void>();

  private readonly publicProductCatalogService = inject(PublicProductCatalogService);

  readonly flipped = signal(false);

  readonly imageUrl = computed(() =>
    this.product.hasImage ? this.publicProductCatalogService.getImageUrl(this.product.id) : null,
  );

  toggleFlip(): void {
    this.flipped.update((value) => !value);
  }

  requestInterest(): void {
    this.interest.emit();
  }
}
