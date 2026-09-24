import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ParallaxLayerDirective } from '../../directives/parallax-layer.directive';
import { MouseShiftDirective } from '../../directives/mouse-shift.directive';
import {
  BackgroundPosition,
  BackgroundSize,
  DepthEffect,
  MovementMode,
  OverlayLevel,
  ParallaxIntensity,
} from '../../../core/models';

const POSITION_CSS: Record<BackgroundPosition, string> = {
  center: 'center center',
  'center-left': 'left center',
  'center-right': 'right center',
  top: 'center top',
  bottom: 'center bottom',
};

const SIZE_CSS: Record<BackgroundSize, string> = {
  small: '38%',
  medium: '62%',
  large: '88%',
  cover: 'cover',
};

/** blur(px), scale — el scale compensa el blur para que nunca se asome un borde/transparencia al desenfocar. */
const DEPTH_CSS: Record<DepthEffect, { blur: number; scale: number }> = {
  none: { blur: 0, scale: 1 },
  subtle: { blur: 1, scale: 1.02 },
  medium: { blur: 2.5, scale: 1.05 },
  deep: { blur: 5, scale: 1.1 },
};

const OVERLAY_OPACITY: Record<OverlayLevel, number> = {
  none: 0,
  subtle: 0.25,
  medium: 0.45,
  strong: 0.65,
};

/** Velocidad de `ParallaxLayerDirective` por intensidad — misma escala ya usada en los `__glow` de cada sección. */
const PARALLAX_SPEED: Record<ParallaxIntensity, number> = {
  off: 0,
  subtle: 0.07,
  medium: 0.14,
};

/**
 * La capa visual de "marca de agua" — usada TANTO por cada sección real de
 * la landing (alimentada por `PublicLandingBackgroundService`) COMO por la
 * vista previa del panel admin (alimentada por el formulario en edición,
 * antes de guardar) — un solo componente, nunca dos implementaciones, así
 * la vista previa jamás se desincroniza de cómo se ve en producción (mismo
 * criterio ya usado por `BankPreviewModalComponent` reutilizando
 * `BankCardComponent`).
 *
 * Se integra con el sistema 3D ya existente en vez de crear uno nuevo:
 * `ParallaxLayerDirective` (el mismo que ya usan los `__glow` decorativos
 * de cada sección) para el desplazamiento por scroll, y
 * `MouseShiftDirective` (nuevo, ver ese archivo) para el desplazamiento
 * sutil por mouse — deliberadamente NO reutiliza `TiltOnMouseDirective`:
 * ese directive rota (`rotateX`/`rotateY`), pensado para una card; una
 * imagen de fondo tipo "profundidad" debe simplemente desplazarse unos
 * pocos px, nunca inclinarse, que es justo lo que pide la tarea ("cursor →
 * imagen se mueve ligeramente").
 *
 * Nunca intercepta clics — `pointer-events: none` en el host — y siempre
 * queda detrás del contenido real por orden de composición: este
 * componente debe montarse como el PRIMER hijo dentro de una sección
 * `position: relative`, con el resto del contenido de esa sección viniendo
 * después en el DOM (mismo z-index natural que ya usan los `__glow`
 * existentes, sin necesidad de z-index explícito).
 */
@Component({
  selector: 'app-landing-background-layer',
  standalone: true,
  imports: [NgStyle, ParallaxLayerDirective, MouseShiftDirective],
  templateUrl: './landing-background-layer.component.html',
  styleUrl: './landing-background-layer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingBackgroundLayerComponent {
  readonly imageUrl = input<string | null>(null);
  readonly opacity = input(25);
  readonly overlay = input<OverlayLevel>('medium');
  readonly position = input<BackgroundPosition>('center');
  readonly size = input<BackgroundSize>('large');
  readonly depthEffect = input<DepthEffect>('subtle');
  readonly parallax = input<ParallaxIntensity>('subtle');
  readonly movement = input<MovementMode>('scroll_mouse');

  readonly hasParallax = computed(() => this.movement() === 'scroll' || this.movement() === 'scroll_mouse');
  readonly hasMouseShift = computed(() => this.movement() === 'mouse' || this.movement() === 'scroll_mouse');
  readonly isFloating = computed(() => this.movement() === 'floating');

  readonly parallaxSpeed = computed(() => PARALLAX_SPEED[this.parallax()]);

  // `--depth-scale` es una custom property, nunca `transform` directamente
  // — igual razón que `TiltOnMouseDirective`/`ParallaxLayerDirective`: así
  // esta escala (calculada por Angular) y el desplazamiento por mouse
  // (escrito en vivo por `MouseShiftDirective` sobre `--shift-x`/`--shift-y`)
  // se componen en una sola regla CSS (`.bg-layer__image`'s `transform`)
  // sin que ninguno de los dos se pise.
  readonly imageStyle = computed(() => {
    const depth = DEPTH_CSS[this.depthEffect()];
    return {
      'background-image': this.imageUrl() ? `url(${this.imageUrl()})` : 'none',
      'background-position': POSITION_CSS[this.position()],
      'background-size': SIZE_CSS[this.size()],
      opacity: (this.opacity() / 100).toFixed(2),
      filter: depth.blur > 0 ? `blur(${depth.blur}px)` : 'none',
      '--depth-scale': depth.scale,
    };
  });

  readonly overlayStyle = computed(() => ({
    opacity: OVERLAY_OPACITY[this.overlay()].toFixed(2),
  }));
}
