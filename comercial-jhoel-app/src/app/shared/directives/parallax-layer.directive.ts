import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

import { ParallaxService } from '../../core/services/parallax.service';

/**
 * Registers the host element with the app-wide `ParallaxService` so it
 * drifts at its own speed as the page scrolls — the reusable building
 * block behind every section's decorative depth (see each section's own
 * `__glow` elements, which this directive attaches to directly rather
 * than through a new wrapper component: they already exist in every
 * catalog/services/about/contact section, so this is pure augmentation,
 * never a duplicate background system).
 *
 * `[appParallaxLayer]` doubles as its own speed input (same convention as
 * `ngModel`) — a small number, typically 0.03–0.25: background elements
 * use a smaller speed (drift less), foreground ones a larger speed (drift
 * more), which is what actually reads as "depth" rather than everything
 * moving in lockstep with the page.
 */
@Directive({
  selector: '[appParallaxLayer]',
  standalone: true,
})
export class ParallaxLayerDirective implements AfterViewInit, OnDestroy {
  @Input('appParallaxLayer') speed = 0.08;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly parallax = inject(ParallaxService);

  ngAfterViewInit(): void {
    this.parallax.register(this.el.nativeElement, this.speed);
  }

  ngOnDestroy(): void {
    this.parallax.unregister(this.el.nativeElement);
  }
}
