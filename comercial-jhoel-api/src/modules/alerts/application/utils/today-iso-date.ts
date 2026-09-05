/** Local-time `yyyy-MM-dd` — same technique every date-driven use case in this codebase already uses. The API process runs with `TZ=America/Guatemala` (see `docker-compose.yml`/migration `1759100000000-SetDatabaseTimezone`), so `Date`'s own local getters already reflect the correct Guatemala calendar day — never the browser's clock, never UTC. */
export function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Whole calendar days between two `yyyy-MM-dd` strings (`to - from`) — positive when `to` is in the future. Both operands are parsed as UTC midnight by `Date.parse`, so the day-difference is correct regardless of the server's own timezone offset; only `todayIsoDate()` above needs to be timezone-aware, this is pure calendar arithmetic on two already-resolved date strings. */
export function daysBetweenIsoDates(from: string, to: string): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(to) - Date.parse(from)) / MS_PER_DAY);
}
