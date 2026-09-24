import { Injectable } from '@angular/core';

/**
 * Single shared scroll-linked parallax engine for the whole app — ONE
 * `window.scroll`/`resize` listener total, no matter how many decorative
 * layers register with it (`ParallaxLayerDirective` is the consumer-facing
 * side of this). Registering a second, third, Nth layer never adds a
 * second listener; they all ride the same rAF-batched pass. This is what
 * keeps this feature from becoming "a scroll listener per section," which
 * the task explicitly asked to avoid.
 *
 * Only ever writes `transform` (via `translate3d`, GPU-composited, never
 * triggers layout/paint) — never `top`/`left`/`margin`. Disabled entirely
 * (no listener even attached) under `prefers-reduced-motion: reduce`,
 * checked once at construction, not per-frame.
 */
@Injectable({ providedIn: 'root' })
export class ParallaxService {
  private readonly layers = new Map<HTMLElement, number>();
  private ticking = false;
  private readonly enabled: boolean;

  constructor() {
    this.enabled =
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.enabled) {
      window.addEventListener('scroll', this.requestUpdate, { passive: true });
      window.addEventListener('resize', this.requestUpdate, { passive: true });
    }
  }

  register(el: HTMLElement, speed: number): void {
    if (!this.enabled) {
      return;
    }
    this.layers.set(el, speed);
    this.requestUpdate();
  }

  unregister(el: HTMLElement): void {
    this.layers.delete(el);
  }

  private readonly requestUpdate = (): void => {
    if (this.ticking || !this.enabled) {
      return;
    }
    this.ticking = true;
    requestAnimationFrame(() => {
      const viewportCenter = window.innerHeight / 2;
      this.layers.forEach((speed, el) => {
        const rect = el.getBoundingClientRect();
        const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
        const offset = (distanceFromCenter * speed).toFixed(1);
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
      this.ticking = false;
    });
  };
}
