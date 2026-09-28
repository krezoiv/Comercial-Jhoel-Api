import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  TemplateRef,
  contentChild,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import { IconComponent } from '../../../../../shared/ui';

/** Contexto que recibe la plantilla de cada slide: `let-item` + `let-i="index"`. */
export interface LandingCarouselSlideContext<T> {
  $implicit: T;
  index: number;
}

/** Autoplay: avanza una posición cada 5s — mismo ritmo que tenían los carruseles coverflow anteriores. */
const AUTOPLAY_INTERVAL_MS = 5000;
/** Movimiento mínimo (px) de un arrastre con mouse antes de considerarlo "drag" y no un click. */
const DRAG_THRESHOLD_PX = 6;

/**
 * Carrusel full-width compartido por TODA la landing (Teléfonos, Librería,
 * Variedades, Bancos, Noticias) — reemplaza las cuatro copias casi
 * idénticas del antiguo coverflow de una sola card. Cada wrapper de
 * sección (`PhoneCarouselComponent`, `CatalogProductCarouselComponent`,
 * `BankCarouselComponent`, `NewsCarouselComponent`) conserva su selector,
 * inputs y outputs públicos, y solo le pasa a este componente sus items +
 * una `<ng-template>` con la card — nunca una segunda implementación.
 *
 * Mecánica:
 * - Scroll horizontal NATIVO con `scroll-snap` dentro del propio track:
 *   swipe táctil con inercia real, trackpad y rueda horizontal gratis, y
 *   el overflow queda confinado al track (la página nunca hace scroll
 *   horizontal).
 * - Arrastre con mouse (solo `pointerType === 'mouse'`; touch ya lo hace
 *   el navegador) con umbral, y supresión del click que sigue a un drag —
 *   así arrastrar nunca voltea una flip card por accidente.
 * - Flechas, puntos (una posición por "snap" alcanzable, no por item) y
 *   teclado (←/→).
 * - Autoplay solo mientras el carrusel está en pantalla
 *   (IntersectionObserver), pausado con hover/foco/arrastre, nunca con
 *   `prefers-reduced-motion`.
 *
 * Toda la lectura de layout (scroll/resize) corre fuera de la zona de
 * Angular y se agrupa en un rAF; solo se vuelve a entrar a la zona cuando
 * cambia un valor visible (índice activo, límites, cantidad de puntos).
 */
@Component({
  selector: 'app-landing-carousel',
  standalone: true,
  imports: [NgTemplateOutlet, IconComponent],
  templateUrl: './landing-carousel.component.html',
  styleUrl: './landing-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingCarouselComponent<T extends { id: string | number }> implements AfterViewInit, OnDestroy {
  readonly items = input.required<T[]>();
  readonly ariaLabel = input('Carrusel');
  /** Texto accesible de cada slide/punto, p. ej. `phone => phone.brand + ' ' + phone.model`. */
  readonly itemLabel = input<(item: T) => string>(() => '');
  /** Nombre singular para las flechas ("teléfono", "producto"...). */
  readonly itemNoun = input('elemento');

  readonly slideTemplate = contentChild.required<TemplateRef<LandingCarouselSlideContext<T>>>(TemplateRef);

  private readonly trackRef = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);

  readonly activePosition = signal(0);
  readonly positions = signal<number[]>([0]);
  readonly atStart = signal(true);
  readonly atEnd = signal(true);
  readonly inView = signal(false);
  readonly dragging = signal(false);

  private stride = 0;
  private rafId: number | null = null;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private paused = false;
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;

  private dragPointerId: number | null = null;
  private dragStartX = 0;
  private dragStartScroll = 0;
  private dragMoved = false;
  private suppressClick = false;

  private readonly reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor() {
    // Los items llegan después de una petición HTTP — cuando cambian, se
    // recalcula la geometría en el siguiente frame (ya renderizados).
    effect(() => {
      this.items();
      untracked(() => this.scheduleMeasure());
    });
  }

  ngAfterViewInit(): void {
    const track = this.trackRef().nativeElement;

    this.zone.runOutsideAngular(() => {
      track.addEventListener('scroll', this.onScroll, { passive: true });
      track.addEventListener('pointerdown', this.onPointerDown);
      track.addEventListener('pointermove', this.onPointerMove);
      track.addEventListener('pointerup', this.onPointerUp);
      track.addEventListener('pointercancel', this.onPointerCancel);
      track.addEventListener('click', this.onClickCapture, true);

      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.scheduleMeasure());
        this.resizeObserver.observe(track);
      }

      if (typeof IntersectionObserver !== 'undefined') {
        this.intersectionObserver = new IntersectionObserver(
          ([entry]) => this.zone.run(() => this.onVisibilityChange(entry.isIntersecting)),
          { threshold: 0.25 },
        );
        this.intersectionObserver.observe(this.host.nativeElement);
      } else {
        this.zone.run(() => this.onVisibilityChange(true));
      }
    });

    this.scheduleMeasure();
  }

  ngOnDestroy(): void {
    const track = this.trackRef().nativeElement;
    track.removeEventListener('scroll', this.onScroll);
    track.removeEventListener('pointerdown', this.onPointerDown);
    track.removeEventListener('pointermove', this.onPointerMove);
    track.removeEventListener('pointerup', this.onPointerUp);
    track.removeEventListener('pointercancel', this.onPointerCancel);
    track.removeEventListener('click', this.onClickCapture, true);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.stopAutoplay();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }

  // ---- Navegación ----------------------------------------------------------

  prev(): void {
    this.goTo(this.activePosition() - this.pageSize());
  }

  next(): void {
    this.goTo(this.activePosition() + this.pageSize());
  }

  goTo(position: number): void {
    this.scrollToPosition(position, true);
    this.restartAutoplay();
  }

  onKeydown(event: KeyboardEvent): void {
    // Solo cuando el foco está en el propio carrusel — nunca secuestra las
    // flechas dentro de un control de una card.
    if (event.target !== event.currentTarget) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    }
  }

  // ---- Autoplay ------------------------------------------------------------

  pauseAutoplay(): void {
    this.paused = true;
    this.stopAutoplay();
  }

  resumeAutoplay(): void {
    this.paused = false;
    this.startAutoplay();
  }

  private onVisibilityChange(visible: boolean): void {
    if (visible && !this.inView()) {
      this.inView.set(true);
    }
    if (visible) {
      this.startAutoplay();
    } else {
      this.stopAutoplay();
    }
  }

  private startAutoplay(): void {
    if (this.autoplayTimer !== null || this.paused || this.reducedMotion || !this.inView()) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.autoplayTimer = setInterval(() => this.advanceAutoplay(), AUTOPLAY_INTERVAL_MS);
    });
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

  /** Avanza una posición; al llegar al final vuelve al inicio — ciclo continuo. */
  private advanceAutoplay(): void {
    const count = this.positions().length;
    if (count <= 1) {
      return;
    }
    const next = this.activePosition() + 1;
    this.scrollToPosition(next >= count ? 0 : next, true);
  }

  // ---- Arrastre con mouse --------------------------------------------------
  // Registrados a mano fuera de la zona de Angular (ver ngAfterViewInit):
  // un `pointermove` enlazado en la plantilla dispararía detección de
  // cambios en cada movimiento del mouse sobre el carrusel. Solo se vuelve
  // a la zona cuando cambia algo visible (`dragging`).

  private readonly onPointerDown = (event: PointerEvent): void => {
    this.pauseAutoplay();
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return;
    }
    this.dragPointerId = event.pointerId;
    this.dragStartX = event.clientX;
    this.dragStartScroll = this.trackRef().nativeElement.scrollLeft;
    this.dragMoved = false;
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.dragPointerId !== event.pointerId) {
      return;
    }
    const track = this.trackRef().nativeElement;
    const delta = event.clientX - this.dragStartX;
    if (!this.dragMoved) {
      if (Math.abs(delta) < DRAG_THRESHOLD_PX) {
        return;
      }
      // La captura se toma recién al confirmar el drag — capturar en cada
      // `pointerdown` desviaría el `click` de botones/cards al track.
      this.dragMoved = true;
      this.zone.run(() => this.dragging.set(true));
      track.setPointerCapture(event.pointerId);
    }
    track.scrollLeft = this.dragStartScroll - delta;
  }

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse') {
      this.resumeAfterInteraction();
      return;
    }
    if (this.dragPointerId !== event.pointerId) {
      return;
    }
    const track = this.trackRef().nativeElement;
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
    this.dragPointerId = null;
    if (this.dragMoved) {
      this.suppressClick = true;
      this.zone.run(() => this.dragging.set(false));
      // Suelta en la posición "snap" más cercana, con el mismo easing nativo.
      this.scrollToPosition(Math.round(track.scrollLeft / (this.stride || 1)), true);
    }
    this.dragMoved = false;
  }

  private readonly onPointerCancel = (): void => {
    this.dragPointerId = null;
    this.dragMoved = false;
    if (this.dragging()) {
      this.zone.run(() => this.dragging.set(false));
    }
    this.resumeAfterInteraction();
  }

  /** Fase de captura: un click que llega justo después de un drag nunca activa la card de abajo. */
  private readonly onClickCapture = (event: MouseEvent): void => {
    if (this.suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      this.suppressClick = false;
    }
  }

  /** En touch el `mouseleave` no existe — el autoplay se reanuda al soltar. */
  private resumeAfterInteraction(): void {
    if (window.matchMedia('(hover: none)').matches) {
      this.resumeAutoplay();
    }
  }

  // ---- Geometría -----------------------------------------------------------

  /** Paso de las flechas: los slides completamente visibles menos uno (siempre queda uno de contexto), mínimo 1. */
  private pageSize(): number {
    if (!this.stride) {
      return 1;
    }
    return Math.max(1, Math.floor(this.trackRef().nativeElement.clientWidth / this.stride) - 1);
  }

  private scrollToPosition(position: number, smooth: boolean): void {
    const count = this.positions().length;
    const clamped = Math.max(0, Math.min(count - 1, position));
    const track = this.trackRef().nativeElement;
    const first = track.children.item(0) as HTMLElement | null;
    const target = track.children.item(clamped) as HTMLElement | null;
    if (!first || !target) {
      return;
    }
    // `offsetLeft` es relativo al track (`position: relative`), así que la
    // distancia al primer slide ya descuenta el padding lateral del track.
    track.scrollTo({
      left: Math.min(target.offsetLeft - first.offsetLeft, track.scrollWidth - track.clientWidth),
      behavior: smooth && !this.reducedMotion ? 'smooth' : 'auto',
    });
  }

  private readonly onScroll = (): void => this.scheduleMeasure();

  private scheduleMeasure(): void {
    if (this.rafId !== null || typeof requestAnimationFrame === 'undefined') {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.measure();
      });
    });
  }

  private measure(): void {
    const track = this.trackRef?.()?.nativeElement;
    if (!track) {
      return;
    }
    const slides = track.children;
    const first = slides.item(0) as HTMLElement | null;
    const second = slides.item(1) as HTMLElement | null;
    this.stride = first ? (second ? second.offsetLeft - first.offsetLeft : first.offsetWidth) : 0;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const count = this.stride > 0 ? Math.max(1, Math.ceil(maxScroll / this.stride - 0.05) + 1) : 1;
    const active = this.stride > 0 ? Math.min(count - 1, Math.round(track.scrollLeft / this.stride)) : 0;
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft >= maxScroll - 2;

    if (
      count !== this.positions().length ||
      active !== this.activePosition() ||
      atStart !== this.atStart() ||
      atEnd !== this.atEnd()
    ) {
      this.zone.run(() => {
        if (count !== this.positions().length) {
          this.positions.set(Array.from({ length: count }, (_, i) => i));
        }
        this.activePosition.set(active);
        this.atStart.set(atStart);
        this.atEnd.set(atEnd);
      });
    }
  }
}
