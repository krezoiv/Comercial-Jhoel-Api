import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';

import { PublicCatalogProduct } from '../../../../../core/models';
import { PublicProductCatalogService } from '../../../../../core/services/public-product-catalog.service';
import { formatCurrency } from '../../../../../core/utils/number-format.util';
import { hasLiked, setLiked } from '../../../../../core/utils/local-likes.util';
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
    this.liked.set(hasLiked('product', this.product.id));
    this.likesCount.set(this.product.likesCount);
  }

  toggleFlip(): void {
    this.flipped.update((value) => !value);
  }

  requestInterest(): void {
    this.interest.emit();
  }

  /** Optimista: refleja el nuevo estado de inmediato y lo revierte si la llamada falla. */
  toggleLike(): void {
    if (this.likeBusy()) {
      return;
    }
    const next = !this.liked();
    this.liked.set(next);
    this.likesCount.update((count) => Math.max(0, count + (next ? 1 : -1)));
    setLiked('product', this.product.id, next);
    this.likeBusy.set(true);

    const request$ = next
      ? this.publicProductCatalogService.likeProduct(this.product.id)
      : this.publicProductCatalogService.unlikeProduct(this.product.id);

    request$.subscribe({
      next: (count) => {
        this.likesCount.set(count);
        this.likeBusy.set(false);
      },
      error: () => {
        this.liked.set(!next);
        this.likesCount.update((count) => Math.max(0, count + (next ? -1 : 1)));
        setLiked('product', this.product.id, !next);
        this.likeBusy.set(false);
      },
    });
  }
}
