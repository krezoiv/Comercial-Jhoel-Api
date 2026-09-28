import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

/** Variante de entrada — `up` (por defecto) = fade + translateY; ver `.reveal--*` en styles/_base.scss. */
export type RevealVariant = 'up' | 'fade' | 'scale' | 'left' | 'right';

/**
 * Adds `.is-visible` to the host once it scrolls into view, using
 * IntersectionObserver. Pair with the `.reveal` utility class in
 * styles/_base.scss (or a component-local equivalent) for the actual
 * fade/slide transition — this directive only toggles state.
 */
@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
  host: {
    class: 'reveal',
  },
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  @Input() revealDelay = 0;
  @Input() revealVariant: RevealVariant = 'up';

  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.el.nativeElement.classList.add('is-visible');
      return;
    }

    this.el.nativeElement.style.setProperty('--reveal-delay', `${this.revealDelay}ms`);
    if (this.revealVariant !== 'up') {
      this.el.nativeElement.classList.add(`reveal--${this.revealVariant}`);
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.el.nativeElement.classList.add('is-visible');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
