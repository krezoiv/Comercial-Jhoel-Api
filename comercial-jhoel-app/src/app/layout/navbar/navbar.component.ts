import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  NgZone,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

import { NAV_LINKS, NAV_LOGIN_LINK, SITE } from '../../core/data';
import { AuthService } from '../../core/services/auth.service';
import {
  ButtonComponent,
  ContainerComponent,
  IconComponent,
} from '../../shared/ui';
import { NotificationsModalComponent } from './components/notifications-modal/notifications-modal.component';

/**
 * Secciones de la landing (en orden de página) → etiqueta del enlace del
 * navbar que las representa. Los catálogos viven bajo "Servicios", así que
 * al recorrerlos el enlace activo sigue siendo "Servicios".
 */
const SECTION_TO_LINK: ReadonlyArray<readonly [sectionId: string, linkLabel: string]> = [
  ['inicio', 'Inicio'],
  ['servicios', 'Servicios'],
  ['telefonos', 'Servicios'],
  ['libreria', 'Servicios'],
  ['variedades', 'Servicios'],
  ['noticias', 'Noticias'],
  ['agentes-bancarios', 'Servicios'],
  ['quienes-somos', 'Servicios'],
  ['contacto', 'Contacto'],
];

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ContainerComponent, ButtonComponent, IconComponent, NotificationsModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private readonly progressBar = viewChild<ElementRef<HTMLElement>>('progressBar');

  readonly site = SITE;
  readonly navLinks = NAV_LINKS;

  readonly isScrolled = signal(false);
  readonly isMenuOpen = signal(false);
  /** Controla `NotificationsModalComponent`, montado una sola vez aquí — nunca un segundo Navbar ni un segundo menú móvil. */
  readonly isNotificationsModalOpen = signal(false);

  /** Label of the desktop dropdown currently open (`null` = none). At most one at a time. */
  private readonly openDropdownLabel = signal<string | null>(null);
  /** Label of the mobile accordion group currently expanded (`null` = none). */
  private readonly openMobileGroupLabel = signal<string | null>(null);

  readonly accountLink = computed(() =>
    this.authService.isAuthenticated()
      ? { label: 'Sistema', path: '/dashboard', icon: 'grid' }
      : { ...NAV_LOGIN_LINK, icon: 'log-in' },
  );

  /** Solo en la landing (`/`) el navbar arranca transparente sobre el Hero; en el resto de páginas públicas siempre es sólido. */
  readonly isLanding = signal(this.isLandingUrl(this.router.url));
  readonly isOverlay = computed(() => this.isLanding() && !this.isScrolled() && !this.isMenuOpen());

  /** Etiqueta del enlace cuya sección está en pantalla (scrollspy) — `null` fuera de la landing. */
  readonly activeLink = signal<string | null>(null);

  private scrollRaf: number | null = null;

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.isLanding.set(this.isLandingUrl(event.urlAfterRedirects));
        this.requestScrollUpdate();
      });

    // Un único listener pasivo de scroll, FUERA de la zona de Angular y
    // agrupado en un rAF — antes era un `@HostListener('window:scroll')`
    // que disparaba detección de cambios en cada evento de scroll. Ahora
    // solo se vuelve a la zona cuando cambia algo visible (fondo del
    // navbar o enlace activo); la barra de progreso se escribe directo en
    // el DOM, sin detección de cambios.
    afterNextRender(() => {
      this.zone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.requestScrollUpdate, { passive: true });
        window.addEventListener('resize', this.requestScrollUpdate, { passive: true });
      });
      this.requestScrollUpdate();
    });

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', this.requestScrollUpdate);
      window.removeEventListener('resize', this.requestScrollUpdate);
      if (this.scrollRaf !== null) {
        cancelAnimationFrame(this.scrollRaf);
      }
    });
  }

  private readonly requestScrollUpdate = (): void => {
    if (this.scrollRaf !== null || typeof requestAnimationFrame === 'undefined') {
      return;
    }
    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = null;
      this.updateFromScroll();
    });
  };

  private updateFromScroll(): void {
    const scrollY = window.scrollY;
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);

    const bar = this.progressBar()?.nativeElement;
    if (bar) {
      bar.style.transform = `scaleX(${Math.min(1, scrollY / maxScroll).toFixed(4)})`;
    }

    const scrolled = scrollY > 8;
    const active = this.isLanding() ? this.computeActiveLink() : null;
    if (scrolled !== this.isScrolled() || active !== this.activeLink()) {
      this.zone.run(() => {
        this.isScrolled.set(scrolled);
        this.activeLink.set(active);
      });
    }
  }

  /** La última sección cuyo borde superior ya cruzó una línea a ~30% del viewport bajo el navbar. */
  private computeActiveLink(): string | null {
    const line = window.innerHeight * 0.3 + 76;
    let current: string | null = null;
    for (const [sectionId, linkLabel] of SECTION_TO_LINK) {
      const element = document.getElementById(sectionId);
      if (element && element.getBoundingClientRect().top <= line) {
        current = linkLabel;
      }
    }
    return current;
  }

  private isLandingUrl(url: string): boolean {
    return url.split(/[?#]/)[0] === '/';
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

  openNotificationsModal(): void {
    this.closeMenu();
    this.isNotificationsModalOpen.set(true);
  }

  closeNotificationsModal(): void {
    this.isNotificationsModalOpen.set(false);
  }
}
