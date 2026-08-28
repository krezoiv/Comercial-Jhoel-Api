import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { DashboardSummaryService } from '../../../core/services/dashboard-summary.service';
import { CardComponent, IconComponent } from '../../../shared/ui';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink, CardComponent, IconComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomeComponent {
  private readonly authService = inject(AuthService);
  private readonly summaryService = inject(DashboardSummaryService);

  readonly currentUser = this.authService.currentUser;
  readonly today = signal(new Date());
  readonly summary$ = this.summaryService.getSummary();
}
