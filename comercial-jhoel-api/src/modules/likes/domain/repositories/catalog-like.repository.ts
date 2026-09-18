export const CATALOG_LIKE_REPOSITORY = Symbol('CATALOG_LIKE_REPOSITORY');

/** Un valor por cada tabla pública con Like — mismo valor que `catalog_likes.entity_type`. */
export type CatalogLikeEntityType = 'PHONE' | 'PRODUCT' | 'NEWS';

/** El toggle que decide cada use case de like/unlike por módulo. */
export type CatalogLikeAction = 'LIKE' | 'UNLIKE';

/**
 * Almacenamiento genérico y compartido de "me gusta" — reemplaza el
 * contador ciego (`likes_count` + delta confiado del frontend) por una
 * tabla real de quién le dio like a qué, con anti-duplicado a nivel de BD
 * (PK compuesta `(entity_type, entity_id, visitor_id)`). Reutilizado por
 * `catalog` (teléfonos), `product-catalog` (Librería/Variedades) y `news` —
 * cada módulo conserva su propia validación (existencia, visibilidad
 * pública) en su propio use case de like/unlike, y solo delega el
 * almacenamiento/conteo genérico aquí.
 */
export interface CatalogLikeRepository {
  /** INSERT ... ON CONFLICT DO NOTHING — idempotente: no duplica ni lanza si ese visitante ya le había dado like a este ítem. */
  like(entityType: CatalogLikeEntityType, entityId: string, visitorId: string): Promise<void>;
  /** DELETE — idempotente: no-op si ese visitante no le había dado like a este ítem. */
  unlike(entityType: CatalogLikeEntityType, entityId: string, visitorId: string): Promise<void>;
  getCount(entityType: CatalogLikeEntityType, entityId: string): Promise<number>;
  /** Conteo real de varios ítems en una sola consulta — evita N+1 al listar un catálogo completo. */
  getCountsBatch(entityType: CatalogLikeEntityType, entityIds: string[]): Promise<Map<string, number>>;
  /** De los ids dados, cuáles ya tienen like de este visitante — para pintar el corazón activo en un listado sin N+1. */
  getLikedEntityIds(
    entityType: CatalogLikeEntityType,
    visitorId: string,
    entityIds: string[],
  ): Promise<Set<string>>;
}
