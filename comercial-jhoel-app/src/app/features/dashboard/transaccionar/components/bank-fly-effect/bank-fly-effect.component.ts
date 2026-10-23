import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Copia del icono elegido que vuela al frente (posición fija sobre la pantalla). */
export interface FlyingMark {
  left: number;
  top: number;
  size: number;
  /** Desplazamiento hasta el centro de la pantalla. */
  dx: number;
  dy: number;
  /** Escala final — suficiente para cubrir toda la pantalla. */
  scale: number;
  imageUrl: string | null;
  monogram: string;
}

/**
 * Efecto de selección de banco en Transaccionar: el icono parte de su
 * posición real en la tarjeta, viene al centro, crece hasta rebasar la
 * pantalla y se disuelve con un destello ("la atraviesa"). Solo visual.
 */
@Component({
  selector: 'app-bank-fly-effect',
  standalone: true,
  template: `
    <span class="fly-flash"></span>
    <span
      class="fly-mark"
      [class.fly-mark--image]="mark.imageUrl"
      [style.left.px]="mark.left"
      [style.top.px]="mark.top"
      [style.width.px]="mark.size"
      [style.height.px]="mark.size"
      [style.--dx]="mark.dx + 'px'"
      [style.--dy]="mark.dy + 'px'"
      [style.--scale-end]="mark.scale"
      [style.font-size.px]="mark.size * 0.28"
    >
      @if (mark.imageUrl) {
        <img [src]="mark.imageUrl" alt="" />
      } @else {
        {{ mark.monogram }}
      }
    </span>
  `,
  styleUrl: './bank-fly-effect.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class BankFlyEffectComponent {
  @Input({ required: true }) mark!: FlyingMark;
}
