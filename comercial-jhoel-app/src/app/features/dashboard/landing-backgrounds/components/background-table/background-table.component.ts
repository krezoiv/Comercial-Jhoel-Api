import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { LandingBackground } from '../../../../../core/models';
import { BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';

const SKELETON_ROWS = 4;

/** A lo sumo un fondo activo por sección — sin orden entre sí, así que sin subir/bajar (a diferencia de `CatalogBankTableComponent`). */
@Component({
  selector: 'app-background-table',
  standalone: true,
  imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent],
  templateUrl: './background-table.component.html',
  styleUrl: './background-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundTableComponent {
  @Input() backgrounds: LandingBackground[] = [];
  @Input() loading = false;
  @Input() sectionLabel: (sectionKey: string) => string = (key) => key;

  @Output() edit = new EventEmitter<LandingBackground>();
  @Output() manageImage = new EventEmitter<LandingBackground>();
  @Output() preview = new EventEmitter<LandingBackground>();
  @Output() toggleActive = new EventEmitter<LandingBackground>();
  @Output() addBackground = new EventEmitter<void>();

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });
}
