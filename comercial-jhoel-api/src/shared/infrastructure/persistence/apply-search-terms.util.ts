import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/**
 * Splits a raw search term on whitespace and ANDs one `search_normalize(...)`-based
 * condition per word onto the query builder, so a multi-word term like "garcia lopez"
 * or "juan garcia" matches regardless of word order/adjacency across the target
 * field(s) — each word just has to appear *somewhere* among them. Centralizes the
 * word-splitting so it's never duplicated per-repository — see
 * `AddSearchNormalizationSupport` and `search_normalize()` for the underlying
 * accent/case-insensitive comparison this builds on.
 *
 * `buildCondition` receives each word's bound parameter name and must return a raw
 * SQL WHERE-clause fragment referencing `:<thatParamName>` (typically an OR across
 * one or more `search_normalize(field) LIKE search_normalize(:<paramName>)` checks).
 */
export function applySearchTerms<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  rawSearch: string,
  buildCondition: (paramName: string) => string,
): void {
  const words = rawSearch.trim().split(/\s+/).filter(Boolean);
  words.forEach((word, index) => {
    const paramName = `searchWord${index}`;
    qb.andWhere(buildCondition(paramName), { [paramName]: `%${word}%` });
  });
}
