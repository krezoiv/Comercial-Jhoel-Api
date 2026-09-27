export interface DashboardNavItem {
  label: string;
  icon: string;
  /** Path segment relative to /dashboard, '' for the overview page. For a group (has `children`) it is only a unique id, never navigated to. */
  path: string;
  /** Sub-items rendered nested under this one. Up to two levels: a group's child may itself be a submenu with its own `children`. */
  children?: DashboardNavItem[];
  /** Restricts visibility to these roles. Omit for "visible to every authenticated role". UI-only — the backend re-checks on every request. */
  roles?: string[];
}
