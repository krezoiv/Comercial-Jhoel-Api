export interface DashboardNavItem {
  label: string;
  icon: string;
  /** Path segment relative to /dashboard, '' for the overview page. */
  path: string;
  /** Sub-items rendered nested under this one, e.g. Inventario under Librería. */
  children?: DashboardNavItem[];
}
