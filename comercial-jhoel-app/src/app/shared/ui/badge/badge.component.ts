import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';

export type BadgeTone = 'brand' | 'gold' | 'success' | 'danger' | 'neutral-dark' | 'neutral-light';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  @Input() tone: BadgeTone = 'brand';
  /** Lets a long label wrap onto several lines instead of overflowing a narrow container (badges never wrap by default). */
  @Input({ transform: booleanAttribute }) wrap = false;
}
