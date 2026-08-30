import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { PurchaseDraftStore } from '../../core/services/purchase-draft.store';
import { SalesDraftStore } from '../../core/services/sales-draft.store';
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
  private readonly salesDraftStore = inject(SalesDraftStore);
  private readonly purchaseDraftStore = inject(PurchaseDraftStore);

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
    // Must run before `authService.logout()` — the purchase draft's storage
    // key is scoped by the (still current, about-to-log-out) user's id, so
    // clearing it after the session was already torn down would silently
    // miss it and leave the draft sitting in sessionStorage.
    this.salesDraftStore.resetOnLogout();
    this.purchaseDraftStore.reset();
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  /**
   * Only the Compras draft is at real risk from an accidental tab close —
   * it lives in `sessionStorage`, which a reload survives but a closed tab
   * doesn't. Ventas has nothing to warn about: its draft is already a real,
   * server-persisted `OPEN` sale, so closing the tab can't lose it.
   */
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.purchaseDraftStore.hasActiveDraft()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }
}
