/**
 * Permissions of "Revisión de días operativos". The app's RBAC is role-based
 * (no per-user permission table), so each permission maps to the roles that
 * hold it. The SQL write functions enforce the very same map
 * (`financial_review_assert_role`), so the API check is defence in depth,
 * never the only barrier.
 *
 * - `financial_days.review`  — browse days, diagnostics, audit (read only).
 * - `financial_days.correct` — open/close a review session and correct data.
 */
export const FINANCIAL_DAY_PERMISSIONS = {
  review: 'financial_days.review',
  correct: 'financial_days.correct',
} as const;

export type FinancialDayPermission =
  (typeof FINANCIAL_DAY_PERMISSIONS)[keyof typeof FINANCIAL_DAY_PERMISSIONS];

export const FINANCIAL_DAY_PERMISSION_ROLES: Record<
  FinancialDayPermission,
  readonly string[]
> = {
  'financial_days.review': ['SUPER_ADMIN', 'ADMIN'],
  'financial_days.correct': ['SUPER_ADMIN'],
};

/** True when `role` holds `permission`. */
export function hasFinancialDayPermission(
  role: string | undefined | null,
  permission: FinancialDayPermission,
): boolean {
  return !!role && FINANCIAL_DAY_PERMISSION_ROLES[permission].includes(role);
}
