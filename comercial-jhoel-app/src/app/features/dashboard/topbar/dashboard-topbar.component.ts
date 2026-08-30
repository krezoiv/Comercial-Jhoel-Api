import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { IconComponent } from '../../../shared/ui';

@Component({
  selector: 'app-dashboard-topbar',
  standalone: true,
  imports: [DatePipe, RouterLink, IconComponent],
  templateUrl: './dashboard-topbar.component.html',
  styleUrl: './dashboard-topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTopbarComponent {
  @Output() menuToggled = new EventEmitter<void>();
  @Output() changePasswordRequested = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();

  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);

  readonly currentUser = this.authService.currentUser;
  readonly now = signal(new Date());
  readonly isUserMenuOpen = signal(false);

  /** "Modo Claro / Modo Oscuro" — `ThemeService` es la única fuente; este componente solo lee su signal y le pide cambiar. */
  readonly isDarkTheme = computed(() => this.themeService.theme() === 'DARK');

  toggleTheme(): void {
    this.themeService.setTheme(this.isDarkTheme() ? 'LIGHT' : 'DARK');
  }

  constructor() {
    const intervalId = setInterval(() => this.now.set(new Date()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(intervalId));
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((open) => !open);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  requestChangePassword(): void {
    this.closeUserMenu();
    this.changePasswordRequested.emit();
  }

  requestLogout(): void {
    this.closeUserMenu();
    this.logoutRequested.emit();
  }
}
