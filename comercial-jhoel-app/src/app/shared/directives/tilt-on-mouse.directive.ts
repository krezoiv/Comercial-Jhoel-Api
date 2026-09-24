import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

/**
 * Subtle mouse-reactive 3D tilt (`rotateX`/`rotateY`) — deliberately never
 * touches the host's own `transform` directly. Instead it writes two CSS
 * custom properties, `--tilt-x`/`--tilt-y`, and the CONSUMING stylesheet
 * (e.g. `card.component.scss`'s `.card--tilt`) is the one that folds them
 * into its own `transform` chain alongside whatever hover-lift
 * (`translateY`) that element already has. This is what lets a card keep
 * its existing CSS `:hover` lift working unmodified while also tilting —
 * an inline `style.transform` write from here would silently win over (and
 * kill) that `:hover` rule's own `transform`, since an inline style always
 * beats an external stylesheet rule, `:hover` included.
 *
 * Never attached at all — not just visually neutered — on a touch device
 * (`(hover: hover)` false) or under `prefers-reduced-motion: reduce`,
 * checked once, not per event. `[appTiltOnMouse]` doubles as an
 * enable/disable input (same convention as `ngModel`) so a consumer can
 * still opt out per-instance even on a capable device (e.g.
 * `[appTiltOnMouse]="false"`).
 */
@Directive({
  selector: '[appTiltOnMouse]',
  standalone: true,
})
export class TiltOnMouseDirective implements AfterViewInit, OnDestroy {
  @Input('appTiltOnMouse') enabled = true;
  /** Max rotation in degrees at the very edge of the element. Small on purpose — this is a hint of depth, not a gimbal. */
  @Input() tiltMax = 6;

  private readonly el = inject(ElementRef<HTMLElement>);
  private attached = false;
  private raf: number | null = null;

  ngAfterViewInit(): void {
    const capable =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.enabled || !capable) {
      return;
    }

    this.attached = true;
    const host = this.el.nativeElement;
    host.addEventListener('mousemove', this.onMove, { passive: true });
    host.addEventListener('mouseleave', this.onLeave, { passive: true });
  }

  ngOnDestroy(): void {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf);
    }
    if (!this.attached) {
      return;
    }
    const host = this.el.nativeElement;
    host.removeEventListener('mousemove', this.onMove);
    host.removeEventListener('mouseleave', this.onLeave);
  }

  private readonly onMove = (event: MouseEvent): void => {
    if (this.raf !== null) {
      return;
    }
    this.raf = requestAnimationFrame(() => {
      this.raf = null;
      const rect = this.el.nativeElement.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      // Mueve el mouse a la izquierda → rotateY negativo; arriba → rotateX positivo
      // (misma convención que pidió la tarea).
      const style = this.el.nativeElement.style;
      style.setProperty('--tilt-y', `${(px * this.tiltMax * 2).toFixed(2)}deg`);
      style.setProperty('--tilt-x', `${(-py * this.tiltMax * 2).toFixed(2)}deg`);
    });
  };

  private readonly onLeave = (): void => {
    const style = this.el.nativeElement.style;
    style.setProperty('--tilt-x', '0deg');
    style.setProperty('--tilt-y', '0deg');
  };
}
