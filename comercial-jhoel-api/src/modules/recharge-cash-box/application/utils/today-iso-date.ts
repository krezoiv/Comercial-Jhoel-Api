function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * `yyyy-MM-dd` in local server time (`TZ=America/Guatemala`, see
 * `docker-compose.yml`) — same technique every date-driven use case in this
 * codebase already uses (e.g. Recargas' own `todayIsoDate()`), kept as this
 * module's own copy per the established "small per-feature copy over
 * cross-feature coupling" convention rather than importing across the
 * module boundary.
 */
export function todayIsoDate(): string {
  return toIsoDate(new Date());
}

/** One calendar day past today, local server time — the furthest `businessDate` a withdrawal may be dated to (see `assertValidOperationDate`). */
export function maxAllowedOperationDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toIsoDate(date);
}
