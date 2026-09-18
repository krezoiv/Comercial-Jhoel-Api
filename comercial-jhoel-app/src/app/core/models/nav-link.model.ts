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
}
