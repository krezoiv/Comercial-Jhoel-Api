import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

/**
 * Desplazamiento sutil de posición (nunca rotación — ver
 * `TiltOnMouseDirective` para el caso de cards) siguiendo el mouse dentro
 * del propio host. Escribe `--shift-x`/`--shift-y` (píxeles) como custom
 * properties en el host — nunca toca `transform` directamente — así
 * cualquier descendiente puede leerlas vía herencia normal de CSS custom
 * properties y componerlas con sus propias transformaciones (mismo
 * convenio ya usado por `HeroComponent`'s `--mx`/`--my`, que
 * `.hero__cursor-light` lee igual de un ancestro).
 *
 * Nunca se adjunta en touch (`hover: hover` falso) ni con
 * `prefers-reduced-motion: reduce` — comprobado una sola vez, no por
 * evento.
 */
@Directive({
  selector: '[appMouseShift]',
  standalone: true,
})
export class MouseShiftDirective implements AfterViewInit, OnDestroy {
  @Input('appMouseShift') enabled = true;
  /** Desplazamiento máximo en px al borde del elemento — deliberadamente pequeño. */
  @Input() maxShift = 10;

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
      const style = this.el.nativeElement.style;
      style.setProperty('--shift-x', `${(px * this.maxShift * 2).toFixed(1)}px`);
      style.setProperty('--shift-y', `${(py * this.maxShift * 2).toFixed(1)}px`);
    });
  };

  private readonly onLeave = (): void => {
    const style = this.el.nativeElement.style;
    style.setProperty('--shift-x', '0px');
    style.setProperty('--shift-y', '0px');
  };
}
