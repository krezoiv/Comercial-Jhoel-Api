import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IconComponent } from '../../../../shared/ui';

interface FlowStep {
  icon: string;
  label: string;
}

/**
 * Purely decorative "product dashboard" visual for the hero: a flow card
 * plus a couple of floating stat chips. Built with CSS/SVG only so it stays
 * lightweight and easy to restyle without touching markup.
 *
 * Escena 3D: panel, chips y "tiles" de catálogo viven a distinta
 * profundidad (`translateZ`) dentro de un escenario con `preserve-3d` que
 * rota muy levemente según `--hx`/`--hy` — variables que escribe el
 * listener de mouse que `HeroComponent` ya tenía (este componente no
 * agrega ninguno propio). Sin mouse (touch/reduced-motion) queda en una
 * pose fija en perspectiva.
 */
@Component({
  selector: 'app-hero-showcase',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './hero-showcase.component.html',
  styleUrl: './hero-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroShowcaseComponent {
  readonly steps: FlowStep[] = [
    { icon: 'book', label: 'Catálogo' },
    { icon: 'shopping-bag', label: 'Venta' },
    { icon: 'bank', label: 'Agente bancario' },
    { icon: 'shield-check', label: 'Cliente feliz' },
  ];

  /** Los cuatro catálogos de la landing, flotando alrededor del panel. */
  readonly tiles: FlowStep[] = [
    { icon: 'smartphone', label: 'Teléfonos' },
    { icon: 'book-open', label: 'Librería' },
    { icon: 'gift', label: 'Accesorios' },
    { icon: 'credit-card', label: 'Bancos' },
  ];
}
