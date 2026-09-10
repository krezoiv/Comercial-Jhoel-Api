import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IconComponent } from '../icon/icon.component';

export type SummaryTileTone = 'primary' | 'success' | 'danger' | 'gold' | 'neutral';

/**
 * Standard KPI tile (icon + title + value + optional description) used inside
 * every `*-summary` component's `<app-card>` grid. `tone` maps to the small,
 * reusable semantic palette in `_tokens.scss` — never pick a color ad hoc per
 * page, pick the tone that matches what the number means (success/danger/gold
 * for money/neutral counts).
 */
@Component({
  selector: 'app-summary-tile',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './summary-tile.component.html',
  styleUrl: './summary-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryTileComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string;
  @Input() description?: string;
  @Input() tone: SummaryTileTone = 'primary';
}
