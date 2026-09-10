import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CardComponent, SummaryTileComponent, SummaryTileTone } from '../../../../../shared/ui';

export interface ReportSummaryTile {
  icon: string;
  title: string;
  value: string;
  description: string;
  tone?: SummaryTileTone;
}

/** Generic KPI-tile row shared by both reports — same `app-card` grid shape every other summary in this app already uses (Suppliers, Inventory, Categories...). */
@Component({
  selector: 'app-report-summary',
  standalone: true,
  imports: [CardComponent, SummaryTileComponent],
  templateUrl: './report-summary.component.html',
  styleUrl: './report-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportSummaryComponent {
  @Input({ required: true }) tiles: ReportSummaryTile[] = [];
  @Input() loading = false;
}
