import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';

import { CatalogRequestType, PublicCatalogPhone } from '../../../../../../core/models';
import { PublicCatalogService } from '../../../../../../core/services/public-catalog.service';
import { formatCurrency } from '../../../../../../core/utils/number-format.util';
import { BadgeComponent, ButtonComponent, IconComponent, LikeButtonComponent } from '../../../../../../shared/ui';

interface DisplaySpec {
  label: string;
  value: string;
}

/**
 * Card individual del carousel — frente (imagen, marca/modelo/precio,
 * badges) y reverso (specs completas + CTAs) unidos por un flip 3D CSS
 * puro (`preserve-3d`/`rotateY`, sin librería de animación — ninguna está
 * instalada en el proyecto). El click en la card entera es solo
 * conveniencia de mouse; el botón "Ver especificaciones" es el control real
 * accesible por teclado (evita anidar un botón dentro de otro elemento con
 * rol de botón).
 */
@Component({
  selector: 'app-phone-card',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, IconComponent, LikeButtonComponent],
  templateUrl: './phone-card.component.html',
  styleUrl: './phone-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneCardComponent implements OnInit {
  @Input({ required: true }) phone!: PublicCatalogPhone;

  @Output() interest = new EventEmitter<CatalogRequestType>();
  /** El zoom de imagen se abre desde un componente de sección (montado fuera del árbol con flip 3D) — ver `ImageLightboxComponent`. */
  @Output() imageZoom = new EventEmitter<{ url: string; alt: string }>();

  private readonly publicCatalogService = inject(PublicCatalogService);

  readonly flipped = signal(false);
  readonly liked = signal(false);
  readonly likesCount = signal(0);
  readonly likeBusy = signal(false);

  formatCurrency = formatCurrency;

  ngOnInit(): void {
    // El estado del like siempre viene del backend (fuente de verdad en PostgreSQL) — nunca de localStorage.
    this.liked.set(this.phone.liked);
    this.likesCount.set(this.phone.likesCount);
  }

  readonly primaryImageUrl = computed(() => {
    const images = this.phone.images;
    if (images.length === 0) {
      return null;
    }
    const primary = images.find((image) => image.isPrimary) ?? images[0];
    return this.publicCatalogService.getImageUrl(primary.id);
  });

  readonly specs = computed<DisplaySpec[]>(() => {
    const phone = this.phone;
    const fixed: DisplaySpec[] = [
      { label: 'Pantalla', value: phone.screen ?? '' },
      { label: 'RAM', value: phone.ram ?? '' },
      { label: 'Almacenamiento', value: phone.storage ?? '' },
      { label: 'Cámara', value: phone.camera ?? '' },
      { label: 'Batería', value: phone.battery ?? '' },
      { label: 'Procesador', value: phone.processor ?? '' },
      { label: 'Sistema operativo', value: phone.operatingSystem ?? '' },
    ].filter((spec) => spec.value);

    return [...fixed, ...phone.extraSpecs];
  });

  toggleFlip(): void {
    this.flipped.update((value) => !value);
  }

  requestInterest(type: CatalogRequestType): void {
    this.interest.emit(type);
  }

  onImageClick(event: Event): void {
    event.stopPropagation();
    const url = this.primaryImageUrl();
    if (!url) {
      return;
    }
    this.imageZoom.emit({ url, alt: `${this.phone.brand} ${this.phone.model}` });
  }

  /** Optimista: refleja el nuevo estado de inmediato y lo revierte si la llamada falla — un "like" nunca debe sentirse lento. El backend es siempre la fuente de verdad final del contador. */
  toggleLike(): void {
    if (this.likeBusy()) {
      return;
    }
    const next = !this.liked();
    this.liked.set(next);
    this.likesCount.update((count) => Math.max(0, count + (next ? 1 : -1)));
    this.likeBusy.set(true);

    const request$ = next
      ? this.publicCatalogService.likePhone(this.phone.id)
      : this.publicCatalogService.unlikePhone(this.phone.id);

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
