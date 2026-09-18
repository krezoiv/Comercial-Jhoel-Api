import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { IconComponent } from '../icon/icon.component';

/**
 * Botón "me gusta" reutilizable — corazón + conteo, usado por Teléfonos,
 * Librería/Variedades y Noticias en la landing pública. Puramente
 * presentacional: no sabe nada de URLs/endpoints (esos difieren por
 * sección) ni de `localStorage` — el padre decide qué endpoint llamar y
 * si recordar el estado "ya di like" de este visitante, este componente
 * solo emite `toggled` y refleja `liked`/`count`.
 */
@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikeButtonComponent {
  @Input() liked = false;
  @Input() count = 0;
  @Input() disabled = false;
  /** Ej. "Producto 3" — arma el `aria-label` ("Dar like a Producto 3"). */
  @Input() label = 'este elemento';

  @Output() toggled = new EventEmitter<void>();

  onClick(event: Event): void {
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.toggled.emit();
  }
}
