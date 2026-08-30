import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';

import { DASHBOARD_NAV_ITEMS, SITE } from '../../../core/data';
import { DashboardNavItem } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { PurchaseDraftStore } from '../../../core/services/purchase-draft.store';
import { SalesDraftStore } from '../../../core/services/sales-draft.store';
import { IceCreamPurchaseDraftStore } from '../../../core/services/ice-cream-purchase-draft.store';
import { IceCreamSaleDraftStore } from '../../../core/services/ice-cream-sale-draft.store';
import { BankBalanceDraftStore } from '../../../core/services/bank-balance-draft.store';
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

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly salesDraftStore = inject(SalesDraftStore);
  private readonly purchaseDraftStore = inject(PurchaseDraftStore);
  private readonly iceCreamPurchaseDraftStore = inject(IceCreamPurchaseDraftStore);
  private readonly iceCreamSaleDraftStore = inject(IceCreamSaleDraftStore);
  private readonly bankBalanceDraftStore = inject(BankBalanceDraftStore);

  readonly site = SITE;

  /** Which top-level groups (by `item.path`) currently have their submenu expanded — an accordion, not a single-open-at-a-time affair, so opening one doesn't yank another shut on the user. */
  private readonly expandedGroups = signal<Set<string>>(new Set());

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    // Whenever navigation lands inside a group's own children, make sure that
    // group is (auto-)expanded — covers first load/refresh on a deep link,
    // and any navigation that didn't originate from clicking inside this
    // sidebar (e.g. a dashboard home-card shortcut). Never auto-collapses a
    // group the user already opened by hand.
    effect(() => {
      const url = this.currentUrl();
      const activeItem = this.navItems().find((item) =>
        item.children?.some((child) => url.includes(`/${child.path}`)),
      );
      if (activeItem) {
        this.expandedGroups.update((current) => {
          if (current.has(activeItem.path)) {
            return current;
          }
          const next = new Set(current);
          next.add(activeItem.path);
          return next;
        });
      }
    });
  }

  /** Drops any item (or child) whose `roles` list excludes the current user's role — e.g. Usuarios/Roles for a USER account. */
  readonly navItems = computed<DashboardNavItem[]>(() => {
    const role = this.authService.currentUser()?.role;
    const isVisible = (item: DashboardNavItem) => !item.roles || (!!role && item.roles.includes(role));

    return DASHBOARD_NAV_ITEMS.filter(isVisible).map((item) =>
      item.children ? { ...item, children: item.children.filter(isVisible) } : item,
    );
  });

  /** Small "en progreso" dot next to Ventas/Compras — non-invasive nudge that a draft is waiting, visible from anywhere in the dashboard. */
  readonly hasSalesDraft = computed(() => this.salesDraftStore.hasActiveDraft());
  readonly hasPurchaseDraft = computed(() => this.purchaseDraftStore.hasActiveDraft());
  readonly hasIceCreamPurchaseDraft = computed(() => this.iceCreamPurchaseDraftStore.hasActiveDraft());
  readonly hasIceCreamSaleDraft = computed(() => this.iceCreamSaleDraftStore.hasActiveDraft());
  readonly hasBankBalanceDraft = computed(() => this.bankBalanceDraftStore.hasActiveDraft());

  hasDraftFor(path: string): boolean {
    if (path === 'ventas') {
      return this.hasSalesDraft();
    }
    if (path === 'compras') {
      return this.hasPurchaseDraft();
    }
    if (path === 'heladeria-compras') {
      return this.hasIceCreamPurchaseDraft();
    }
    if (path === 'heladeria-ventas') {
      return this.hasIceCreamSaleDraft();
    }
    if (path === 'agentes-bancarios-bancos') {
      return this.hasBankBalanceDraft();
    }
    return false;
  }

  draftLabelFor(path: string): string {
    if (path === 'agentes-bancarios-bancos') {
      return 'Cuadre en progreso';
    }
    return path === 'ventas' || path === 'heladeria-ventas' ? 'Venta en progreso' : 'Compra en progreso';
  }

  isExpanded(path: string): boolean {
    return this.expandedGroups().has(path);
  }

  toggleGroup(path: string): void {
    this.expandedGroups.update((current) => {
      const next = new Set(current);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }
}
