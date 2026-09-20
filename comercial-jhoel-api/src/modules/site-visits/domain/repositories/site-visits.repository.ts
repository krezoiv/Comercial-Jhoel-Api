export const SITE_VISITS_REPOSITORY = Symbol('SITE_VISITS_REPOSITORY');

/**
 * Sin entidad de dominio propia a propósito — la única fila de
 * `site_visits` es un contador desnudo (un entero), no un concepto de
 * negocio con invariantes que proteger; envolverlo en una clase de entidad
 * solo habría sido ceremonia sin beneficio real. `increment()` es la única
 * escritura que existe: el frontend nunca puede fijar un valor arbitrario,
 * solo pedir "+1".
 */
export interface SiteVisitsRepository {
  /** `UPDATE ... SET total_count = total_count + 1 ... RETURNING total_count` — atómico por ser una sola sentencia sobre una sola fila. Devuelve el total ya actualizado. */
  increment(): Promise<number>;
  getTotal(): Promise<number>;
}
