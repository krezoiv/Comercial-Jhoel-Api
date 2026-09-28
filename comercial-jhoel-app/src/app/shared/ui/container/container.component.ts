import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-container',
  standalone: true,
  template: `<div class="container" [class.container--wide]="wide" [class.container--fluid]="fluid"><ng-content></ng-content></div>`,
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  @Input({ transform: booleanAttribute }) wide = false;
  /**
   * Sin `max-width` — solo el gutter lateral (`--lp-container-pad`). Para
   * secciones de la landing cuyo protagonista es un carrusel que debe usar
   * prácticamente todo el ancho; el texto dentro de esas secciones mantiene
   * su propio `max-width` legible (encabezados, bloques de contenido).
   */
  @Input({ transform: booleanAttribute }) fluid = false;
}
