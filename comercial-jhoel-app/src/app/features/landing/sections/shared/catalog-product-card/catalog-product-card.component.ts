import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';

import { PublicCatalogProduct } from '../../../../../core/models';
import { PublicProductCatalogService } from '../../../../../core/services/public-product-catalog.service';
import { formatCurrency } from '../../../../../core/utils/number-format.util';
import { ButtonComponent, IconComponent, LikeButtonComponent } from '../../../../../shared/ui';

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
  imports: [ButtonComponent, IconComponent, LikeButtonComponent],
  templateUrl: './catalog-product-card.component.html',
  styleUrl: './catalog-product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogProductCardComponent implements OnInit {
  @Input({ required: true }) product!: PublicCatalogProduct;
  @Input() showInterestButton = false;

  @Output() interest = new EventEmitter<void>();
  /** El zoom de imagen se abre desde un componente de sección (montado fuera del árbol con flip 3D) — ver `ImageLightboxComponent`. */
  @Output() imageZoom = new EventEmitter<{ url: string; alt: string }>();

  private readonly publicProductCatalogService = inject(PublicProductCatalogService);

  readonly flipped = signal(false);
  readonly liked = signal(false);
  readonly likesCount = signal(0);
  readonly likeBusy = signal(false);

  formatCurrency = formatCurrency;

  readonly imageUrl = computed(() =>
    this.product.hasImage ? this.publicProductCatalogService.getImageUrl(this.product.id) : null,
  );

  ngOnInit(): void {
    // El estado del like siempre viene del backend (fuente de verdad en PostgreSQL) — nunca de localStorage.
    this.liked.set(this.product.liked);
    this.likesCount.set(this.product.likesCount);
  }

  toggleFlip(): void {
    this.flipped.update((value) => !value);
  }

  requestInterest(): void {
    this.interest.emit();
  }

  onImageClick(event: Event): void {
    event.stopPropagation();
    const url = this.imageUrl();
    if (!url) {
      return;
    }
    this.imageZoom.emit({ url, alt: this.product.name });
  }

  /** Optimista: refleja el nuevo estado de inmediato y lo revierte si la llamada falla. El backend es siempre la fuente de verdad final del contador. */
  toggleLike(): void {
    if (this.likeBusy()) {
      return;
    }
    const next = !this.liked();
    this.liked.set(next);
    this.likesCount.update((count) => Math.max(0, count + (next ? 1 : -1)));
    this.likeBusy.set(true);

    const request$ = next
      ? this.publicProductCatalogService.likeProduct(this.product.id)
      : this.publicProductCatalogService.unlikeProduct(this.product.id);

    request$.subscribe({
      next: (result) => {
        this.likesCount.set(result.likesCount);
        this.liked.set(result.liked);
        this.likeBusy.set(false);
      },
      error: () => {
        this.liked.set(!next);
        this.likesCount.update((count) => Math.max(0, count + (next ? -1 : 1)));
        this.likeBusy.set(false);
      },
    });
  }
}
