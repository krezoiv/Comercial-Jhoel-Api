/** `Cajero de turno` → `CAJERO_DE_TURNO` — matches the seeded roles' own naming style (SUPER_ADMIN, ADMIN, USER). */
export function normalizeRoleName(name: string): string {
  return name.trim().toUpperCase().replace(/\s+/g, '_');
}
