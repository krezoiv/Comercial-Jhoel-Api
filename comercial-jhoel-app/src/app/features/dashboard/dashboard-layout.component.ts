import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { DashboardSidebarComponent } from './sidebar/dashboard-sidebar.component';
import { DashboardTopbarComponent } from './topbar/dashboard-topbar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, DashboardSidebarComponent, DashboardTopbarComponent, ChangePasswordModalComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSidebarOpen = signal(false);
  readonly isChangePasswordOpen = signal(false);

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((open) => !open);
  }

  openChangePassword(): void {
    this.isChangePasswordOpen.set(true);
  }

  closeChangePassword(): void {
    this.isChangePasswordOpen.set(false);
  }

  logout(): void {
    this.closeSidebar();
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
