import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DASHBOARD_NAV_ITEMS, SITE } from '../../../core/data';
import { IconComponent } from '../../../shared/ui';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSidebarComponent {
  @Input() open = false;
  @Output() closeRequested = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();

  readonly site = SITE;
  readonly navItems = DASHBOARD_NAV_ITEMS;
}
