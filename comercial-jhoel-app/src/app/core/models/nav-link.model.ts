export interface NavLink {
  label: string;
  /** Router path, e.g. '/' or '/catalogo'. */
  path: string;
  /** Optional in-page anchor to scroll to once on `path`. */
  fragment?: string;
  /** Renders as a highlighted call-to-action button instead of a plain link. */
  isCta?: boolean;
  /** Icon shown next to the label (dropdown items only, see `children`). */
  icon?: string;
  /** Sub-items rendered in a dropdown (desktop) / accordion (mobile) under this link. */
  children?: NavLink[];
  /** Renders a visual divider right before this item within its parent's `children` list. */
  dividerBefore?: boolean;
  /**
   * Renders as a plain button that fires an action instead of navigating —
   * `path`/`fragment` are ignored when this is set. Only `'notifications'`
   * exists today (opens `NotificationsModalComponent` from the Navbar);
   * the union stays open for a future action-style item without needing a
   * new field. `FooterComponent`'s own nav list filters these out — an
   * action needs a live component (Navbar) to handle its click, which the
   * footer's plain link list doesn't provide.
   */
  action?: 'notifications';
}
