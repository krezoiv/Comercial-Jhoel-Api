import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContainerComponent } from '../container/container.component';

/**
 * `navy`/`slate` son variantes oscuras adicionales — no un segundo sistema
 * de temas — pensadas para dar jerarquía visual a la landing pública sin
 * volverla un bloque plano de un solo negro (`dark`). Reutilizan tokens de
 * marca que ya existían (`--color-primary-900` = azul marino,
 * `--color-bg-dark-elevated` = superficie oscura ya usada por el propio
 * `[data-theme='dark']` del panel administrativo) — ningún color nuevo.
 * `light`/`muted`/`dark` quedan exactamente igual que antes; esto es
 * puramente aditivo, así que cualquier otro consumidor de `SectionComponent`
 * (fuera de la landing) sigue funcionando sin cambios.
 */
export type SectionTone = 'light' | 'muted' | 'dark' | 'navy' | 'slate';
export type SectionSpacing = 'sm' | 'md' | 'lg';

/**
 * Standard section shell: consistent vertical rhythm, background tone and a
 * centered container. Every landing block should be wrapped in this so
 * spacing stays uniform and easy to retune from one place.
 */
@Component({
  selector: 'app-section',
  standalone: true,
  imports: [ContainerComponent],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {
  /** Anchor id used by in-page navigation (e.g. #quienes-somos). */
  @Input() sectionId?: string;
  @Input() tone: SectionTone = 'light';
  @Input() spacing: SectionSpacing = 'md';
  @Input() wideContainer = false;
}
