import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { IconComponent } from '../icon/icon.component';

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
 */
@Component({
  selector: 'app-image-lightbox',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './image-lightbox.component.html',
  styleUrl: './image-lightbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageLightboxComponent {
  @Input() imageUrl: string | null = null;
  @Input() alt = '';

  @Output() closed = new EventEmitter<void>();

  get open(): boolean {
    return this.imageUrl !== null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.closed.emit();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
