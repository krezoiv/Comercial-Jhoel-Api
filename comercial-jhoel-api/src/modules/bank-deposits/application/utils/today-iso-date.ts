/**
 * `yyyy-MM-dd` in local server time — small per-feature copy of the
 * identical helper in `modules/banks`/`modules/recharges`, following this
 * codebase's established "small per-feature copy over cross-feature
 * coupling" convention for a helper this trivial.
 */
export function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
