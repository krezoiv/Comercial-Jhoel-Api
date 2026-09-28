import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnDestroy, Output, signal } from '@angular/core';

import { IconComponent } from '../icon/icon.component';

/** Duración de la animación de salida — debe coincidir con `.lightbox-backdrop--closing` en el SCSS. */
const LIGHTBOX_EXIT_MS = 180;

/**
 * Visor de imagen ampliada, reutilizable entre Teléfonos/Librería/Variedades
 * — un solo componente, nunca duplicado por catálogo. Se monta como
 * HERMANO del carrusel/grid de cards en el componente de sección (mismo
 * patrón ya usado por `PhoneInterestModalComponent`), nunca anidado dentro
 * de `.{x}-card__inner` (que tiene `transform-style: preserve-3d`) — un
 * overlay `position: fixed` anidado dentro de un ancestro con `transform`
 * queda atrapado por ese ancestro en vez de posicionarse contra el
 * viewport, lo que rompería el efecto flip 3D. Montarlo como hermano evita
 * el problema de raíz.
 *
 * Cierre animado: `close()` primero marca `closing` (fade + zoom de salida,
 * más corto que la entrada) y recién después emite `closed` — el padre
 * sigue siendo quien pone `imageUrl` en `null`, igual que antes.
 */
@Component({
  selector: 'app-image-lightbox',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './image-lightbox.component.html',
  styleUrl: './image-lightbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageLightboxComponent implements OnDestroy {
  @Input() imageUrl: string | null = null;
  @Input() alt = '';

  @Output() closed = new EventEmitter<void>();

  readonly closing = signal(false);
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  get open(): boolean {
    return this.imageUrl !== null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.close();
    }
  }

  close(): void {
    if (this.closing()) {
      return;
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      this.closed.emit();
      return;
    }
    this.closing.set(true);
    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;
      this.closing.set(false);
      this.closed.emit();
    }, LIGHTBOX_EXIT_MS);
  }

  ngOnDestroy(): void {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
    }
  }
}
