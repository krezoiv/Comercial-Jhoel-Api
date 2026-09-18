import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';

import { PublicNewsArticle } from '../../../../../../core/models';
import { IconComponent } from '../../../../../../shared/ui';
import { NewsCardComponent } from '../news-card/news-card.component';

/** Umbral de arrastre (px) para considerar un swipe como navegación, no un simple tap. */
const SWIPE_THRESHOLD_PX = 40;

/** Avanza automáticamente una noticia hacia la izquierda cada 5s — pausa ante cualquier interacción del usuario y se reinicia después. */
const AUTOPLAY_INTERVAL_MS = 5000;

/**
 * Carousel 3D tipo "coverflow" para Noticias — misma mecánica que
 * `PhoneCarouselComponent` (una card activa centrada, vecinas parciales en
 * profundidad, autoplay, swipe táctil/mouse vía Pointer Events, teclado),
 * copiada localmente en vez de compartida como componente genérico
 * (convención ya establecida en este proyecto: una pequeña copia por
 * feature es preferible a un acoplamiento cruzado). Sin flip — `NewsCard`
 * no tiene reverso, solo abre el modal de detalle al hacer click.
 */
@Component({
  selector: 'app-news-carousel',
  standalone: true,
  imports: [IconComponent, NewsCardComponent],
  templateUrl: './news-carousel.component.html',
  styleUrl: './news-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsCarouselComponent implements OnInit {
  @Input({ required: true }) articles: PublicNewsArticle[] = [];

  @Output() opened = new EventEmitter<PublicNewsArticle>();

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
    return this.activeIndex() >= this.articles.length - 1;
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
    if (this.articles.length <= 1) {
      return;
    }
    this.activeIndex.update((i) => (i + 1) % this.articles.length);
  }

  private startAutoplay(): void {
    if (this.autoplayTimer !== null || this.articles.length <= 1) {
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

  onOpen(article: PublicNewsArticle): void {
    this.opened.emit(article);
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
