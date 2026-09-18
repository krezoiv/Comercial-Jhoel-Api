import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';

import { CatalogRequestType, PublicCatalogPhone } from '../../../../../../core/models';
import { IconComponent } from '../../../../../../shared/ui';
import { PhoneCardComponent } from '../phone-card/phone-card.component';

export interface PhoneInterestEvent {
  phone: PublicCatalogPhone;
  requestType: CatalogRequestType;
}

/** Umbral de arrastre (px) para considerar un swipe como navegación, no un simple tap. */
const SWIPE_THRESHOLD_PX = 40;

/** Avanza automáticamente una card hacia la izquierda cada 5s — pausa ante cualquier interacción del usuario (touch/mouse/teclado) y se reinicia después, nunca compite con una navegación manual. */
const AUTOPLAY_INTERVAL_MS = 5000;

/**
 * Carousel 3D tipo "coverflow" — 100% CSS/Angular, sin librería (ninguna
 * instalada en el proyecto). La card activa se muestra al centro, en
 * tamaño completo; las vecinas se muestran parcialmente, más pequeñas y
 * rotadas en profundidad (`rotateY`), con opacidad decreciente. Soporta
 * swipe táctil/mouse vía Pointer Events (unifica touch, mouse y pen — así
 * es sensible al dedo en móvil sin código específico de touch) y botones
 * de navegación — nunca produce scroll horizontal de la página (el track
 * usa `overflow: visible` dentro de un contenedor `overflow: hidden` del
 * ancho del viewport; `touch-action: pan-y` deja el scroll vertical de la
 * página intacto mientras el swipe horizontal controla el carousel).
 *
 * Autoplay: avanza una card hacia la izquierda cada 5s, en bucle continuo.
 * Se pausa ante cualquier señal de que el usuario está interactuando
 * (arrastre táctil/mouse, hover, foco de teclado) y se reinicia después —
 * nunca compite con una navegación manual. Respeta
 * `prefers-reduced-motion` (no arranca el autoplay para quien lo pidió).
 */
@Component({
  selector: 'app-phone-carousel',
  standalone: true,
  imports: [IconComponent, PhoneCardComponent],
  templateUrl: './phone-carousel.component.html',
  styleUrl: './phone-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneCarouselComponent implements OnInit {
  @Input({ required: true }) phones: PublicCatalogPhone[] = [];

  @Output() requestInterest = new EventEmitter<PhoneInterestEvent>();
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
    return this.activeIndex() >= this.phones.length - 1;
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

  /** Autoplay: siempre avanza hacia la izquierda (índice creciente); al llegar a la última, vuelve a la primera para un ciclo continuo. */
  private advanceAutoplay(): void {
    if (this.phones.length <= 1) {
      return;
    }
    this.activeIndex.update((i) => (i + 1) % this.phones.length);
  }

  private startAutoplay(): void {
    if (this.autoplayTimer !== null || this.phones.length <= 1) {
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

  /** Cualquier navegación manual (botones, puntos, swipe, teclado) reinicia el temporizador — nunca deja un auto-avance pendiente pisando la interacción que el usuario acaba de hacer. */
  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  /** Hover o foco de teclado en el carousel pausa el autoplay — nunca debe competir con alguien leyendo o navegando con Tab. */
  pauseAutoplay(): void {
    this.stopAutoplay();
  }

  resumeAutoplay(): void {
    this.startAutoplay();
  }

  offsetOf(index: number): number {
    return index - this.activeIndex();
  }

  /** Solo renderiza/anima las 5 cards más cercanas a la activa — el resto queda fuera de vista, sin costo de layout. */
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

  onInterest(phone: PublicCatalogPhone, requestType: CatalogRequestType): void {
    this.requestInterest.emit({ phone, requestType });
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
