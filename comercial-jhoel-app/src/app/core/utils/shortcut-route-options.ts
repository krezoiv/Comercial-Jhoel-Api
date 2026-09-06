import { DASHBOARD_NAV_ITEMS } from '../data/dashboard-nav.data';
import { DashboardNavItem, ShortcutRouteOption } from '../models';

/**
 * Flattens `DASHBOARD_NAV_ITEMS` — the exact same list the sidebar itself
 * renders from — into a flat `{ label, route }` list for the "Ruta destino"
 * dropdown on "Sistema → Atajos de Teclado". A shortcut can only ever point
 * at a route that's already a real, current sidebar destination — never
 * free text a user could typo into a broken/nonexistent path.
 *
 * The root "Resumen" entry (`path: ''`) is excluded: its own absolute path
 * would be `/dashboard/` (a trailing-slash edge case, not a clean `/dashboard/<segment>`
 * route like every other entry), and this mechanism exists for jumping
 * between *modules*, not the landing page itself.
 */
export function buildShortcutRouteOptions(items: DashboardNavItem[] = DASHBOARD_NAV_ITEMS): ShortcutRouteOption[] {
  const options: ShortcutRouteOption[] = [];

  for (const item of items) {
    if (item.path) {
      options.push({ label: item.label, route: `/dashboard/${item.path}` });
    }
    if (item.children) {
      for (const child of item.children) {
        if (child.path) {
          options.push({ label: `${item.label} · ${child.label}`, route: `/dashboard/${child.path}` });
        }
      }
    }
  }

  return options;
}
