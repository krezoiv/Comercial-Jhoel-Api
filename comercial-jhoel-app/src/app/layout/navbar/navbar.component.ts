import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { NAV_LINKS, NAV_LOGIN_LINK, SITE } from '../../core/data';
import { AuthService } from '../../core/services/auth.service';
import {
  ButtonComponent,
  ContainerComponent,
  IconComponent,
} from '../../shared/ui';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ContainerComponent, ButtonComponent, IconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);

  readonly site = SITE;
  readonly navLinks = NAV_LINKS;

  readonly isScrolled = signal(false);
  readonly isMenuOpen = signal(false);

  /** Label of the desktop dropdown currently open (`null` = none). At most one at a time. */
  private readonly openDropdownLabel = signal<string | null>(null);
  /** Label of the mobile accordion group currently expanded (`null` = none). */
  private readonly openMobileGroupLabel = signal<string | null>(null);

  readonly accountLink = computed(() =>
    this.authService.isAuthenticated()
      ? { label: 'Sistema', path: '/dashboard', icon: 'grid' }
      : { ...NAV_LOGIN_LINK, icon: 'log-in' },
  );

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 8);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDropdown();
  }

  // A `position: fixed` full-screen backdrop (the pattern `AlertBellComponent`
  // uses) doesn't work here: `.navbar` has `backdrop-filter`, which creates a
  // containing block for `position: fixed` descendants, so a backdrop nested
  // inside it only ever covers the navbar's own ~76px strip, not the page. A
  // document-level click check sidesteps that trap entirely.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.openDropdownLabel() === null) {
      return;
    }
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar__dropdown')) {
      this.closeDropdown();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
    this.openMobileGroupLabel.set(null);
    this.closeDropdown();
  }

  isDropdownOpen(label: string): boolean {
    return this.openDropdownLabel() === label;
  }

  toggleDropdown(label: string): void {
    this.openDropdownLabel.update((current) => (current === label ? null : label));
  }

  closeDropdown(): void {
    this.openDropdownLabel.set(null);
  }

  isMobileGroupOpen(label: string): boolean {
    return this.openMobileGroupLabel() === label;
  }

  toggleMobileGroup(label: string): void {
    this.openMobileGroupLabel.update((current) => (current === label ? null : label));
  }
}
