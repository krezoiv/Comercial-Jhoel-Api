import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';

import { PublicCatalogProduct } from '../../../../../core/models';
import { IconComponent } from '../../../../../shared/ui';
import { CatalogProductCardComponent } from '../catalog-product-card/catalog-product-card.component';

/** Umbral de arrastre (px) para considerar un swipe como navegación, no un simple tap. */
const SWIPE_THRESHOLD_PX = 40;

/** Avanza automáticamente una card hacia la izquierda cada 5s — pausa ante cualquier interacción del usuario y se reinicia después. */
const AUTOPLAY_INTERVAL_MS = 5000;

/**
 * Carousel 3D tipo "coverflow" compartido por "Librería" y "Variedades y
 * Accesorios" — misma mecánica que `PhoneCarouselComponent`/
 * `NewsCarouselComponent` (una card activa centrada, vecinas parciales en
 * profundidad, autoplay, swipe táctil/mouse vía Pointer Events, teclado),
 * copiada localmente siguiendo la misma convención ya establecida en este
 * proyecto. Compartido entre las dos secciones (no duplicado dos veces)
 * porque ambas ya reutilizan la misma `CatalogProductCardComponent` — el
 * único punto real de variación entre ellas (mostrar o no "Lo quiero") ya
 * vive en el propio `showInterestButton` de esa card, así que este
 * carousel solo necesita reenviarlo.
 */
@Component({
  selector: 'app-catalog-product-carousel',
  standalone: true,
  imports: [IconComponent, CatalogProductCardComponent],
  templateUrl: './catalog-product-carousel.component.html',
  styleUrl: './catalog-product-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogProductCarouselComponent implements OnInit {
  @Input({ required: true }) products: PublicCatalogProduct[] = [];
  @Input() showInterestButton = false;
  @Input() ariaLabel = 'Catálogo de productos';

  @Output() interest = new EventEmitter<PublicCatalogProduct>();
  @Output() imageZoom = new EventEmitter<{ url: string; alt: string }>();

  readonly activeIndex = signal(0);

  private pointerStartX: number | null = null;
  private pointerId: number | null = null;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.startAutoplay();
    this.destroyRef.onDestroy(() => this.stopAutoplay());
  }

  get isFirst(): boolean {
    return this.activeIndex() === 0;
  }

  get isLast(): boolean {
    return this.activeIndex() >= this.products.length - 1;
  }

  prev(): void {
    if (!this.isFirst) {
      this.activeIndex.update((i) => i - 1);
      this.restartAutoplay();
    }
  }

  next(): void {
    if (!this.isLast) {
      this.activeIndex.update((i) => i + 1);
      this.restartAutoplay();
    }
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
    this.restartAutoplay();
  }

  private advanceAutoplay(): void {
    if (this.products.length <= 1) {
      return;
    }
    this.activeIndex.update((i) => (i + 1) % this.products.length);
  }

  private startAutoplay(): void {
    if (this.autoplayTimer !== null || this.products.length <= 1) {
      return;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    this.autoplayTimer = setInterval(() => this.advanceAutoplay(), AUTOPLAY_INTERVAL_MS);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer !== null) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  pauseAutoplay(): void {
    this.stopAutoplay();
  }

  resumeAutoplay(): void {
    this.startAutoplay();
  }

  offsetOf(index: number): number {
    return index - this.activeIndex();
  }

  isVisible(offset: number): boolean {
    return Math.abs(offset) <= 2;
  }

  slideTransform(offset: number): string {
    const clamped = Math.max(-2, Math.min(2, offset));
    const sign = Math.sign(clamped);
    const abs = Math.abs(clamped);

    if (abs === 0) {
      return 'translateX(0) scale(1) rotateY(0deg)';
    }
    if (abs === 1) {
      return `translateX(${sign * 58}%) scale(0.82) rotateY(${sign * -28}deg)`;
    }
    return `translateX(${sign * 98}%) scale(0.66) rotateY(${sign * -34}deg)`;
  }

  slideOpacity(offset: number): number {
    const abs = Math.abs(offset);
    if (abs === 0) return 1;
    if (abs === 1) return 0.8;
    if (abs === 2) return 0.4;
    return 0;
  }

  slideZIndex(offset: number): number {
    return 10 - Math.abs(offset);
  }

  onInterest(product: PublicCatalogProduct): void {
    this.interest.emit(product);
  }

  onImageZoom(event: { url: string; alt: string }): void {
    this.imageZoom.emit(event);
  }

  onPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
    this.pointerId = event.pointerId;
    this.stopAutoplay();
  }

  onPointerUp(event: PointerEvent): void {
    if (this.pointerStartX === null || this.pointerId !== event.pointerId) {
      return;
    }
    const deltaX = event.clientX - this.pointerStartX;
    this.pointerStartX = null;
    this.pointerId = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
      this.startAutoplay();
      return;
    }
    if (deltaX < 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  onPointerCancel(): void {
    this.pointerStartX = null;
    this.pointerId = null;
    this.startAutoplay();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.prev();
    } else if (event.key === 'ArrowRight') {
      this.next();
    }
  }
}
