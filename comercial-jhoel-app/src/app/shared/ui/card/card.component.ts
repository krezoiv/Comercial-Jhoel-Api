import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';

import { TiltOnMouseDirective } from '../../directives/tilt-on-mouse.directive';

export type CardTone = 'light' | 'dark' | 'glass';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [TiltOnMouseDirective],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() tone: CardTone = 'light';
  @Input({ transform: booleanAttribute }) hoverable = true;
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';
  /**
   * Subtle mouse-reactive 3D tilt (desktop-only, see `TiltOnMouseDirective`
   * for why it's opt-in and CSS-custom-property-driven rather than
   * touching `transform` directly — that's what lets it compose with this
   * same card's own `hoverable` lift without one silently overriding the
   * other). `false` by default — only cards the task called out (Servicios,
   * Créditos, Bancos/Agentes) opt in; the flip-cards (Teléfonos/Librería/
   * Variedades/Bancos catálogo) never do, since they already rotate on
   * `Y` for their flip and a second, independent `rotateY` here would
   * fight that transform.
   */
  @Input({ transform: booleanAttribute }) tilt = false;
}
