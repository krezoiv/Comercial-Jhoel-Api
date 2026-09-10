import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IconComponent } from '../icon/icon.component';

/**
 * Standard dashboard page header — icon badge + title + optional subtitle,
 * with an `<ng-content>` slot for right-side actions (a date picker, a
 * "+ Agregar" button, tab-like controls, etc. — whatever the page's own
 * `<header>` used to hold there). Replaces the near-identical
 * `<header class="x__header"><h1>…</h1><p>…</p></header>` markup every
 * dashboard page used to hand-roll on its own, each with its own duplicated
 * `__title`/`__subtitle` CSS. `icon` is meant to be the same icon already
 * assigned to that page's entry in `dashboard-nav.data.ts` — reusing the
 * identity the user already recognizes from the Sidebar, never a new one
 * invented per page.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
}
