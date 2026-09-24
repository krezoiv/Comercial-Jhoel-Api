import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Buscador profesional" — infraestructura centralizada de normalización de
 * texto para TODAS las búsquedas del sistema (productos, clientes,
 * proveedores, usuarios, bancos, noticias, catálogos, tickets, cotizaciones,
 * facturas). Ninguna otra migración/tabla existente se toca — esto es
 * puramente aditivo: dos extensiones (verificadas como NO instaladas antes
 * de agregarlas, ver `pg_extension` en la doc de este cambio), dos
 * funciones SQL, y dos índices funcionales sobre `products` (la tabla más
 * grande y con más búsquedas del sistema).
 *
 * Por qué una función `IMMUTABLE` envolviendo `unaccent()`: la función
 * `unaccent()` de PostgreSQL está marcada `STABLE`, no `IMMUTABLE` (depende
 * de un diccionario que en teoría podría cambiar), lo que PostgreSQL
 * rechaza usar dentro de un índice funcional. El patrón estándar y
 * documentado de PostgreSQL para resolver esto es envolverla en una función
 * SQL propia que fija el diccionario (`'unaccent'::regdictionary`) y sí se
 * puede declarar `IMMUTABLE` seguramente, porque ese diccionario específico
 * nunca cambia en la práctica.
 *
 * `search_normalize(text)` es el único punto centralizado de normalización
 * — `lower(immutable_unaccent(texto))` — usado simétricamente en AMBOS
 * lados de cada comparación (`search_normalize(columna) LIKE
 * search_normalize(termino)`), así que "García" y "garcia"/"GARCIA"/
 * "garcía" siempre se normalizan de forma IDÉNTICA sin mantener ningún
 * mapa de acentos a mano en TypeScript/Angular.
 *
 * Los índices usan `pg_trgm` (GIN, trigramas) — no un índice funcional
 * B-tree normal — porque las búsquedas existentes son `LIKE '%termino%'`
 * (substring, no solo prefijo); un B-tree normal no acelera ese patrón en
 * absoluto, `pg_trgm` sí. Solo se agregan sobre `products` (la tabla más
 * grande y más consultada de todo el sistema — 1500+ filas reales en
 * producción y creciendo); el resto de tablas con búsqueda (clientes,
 * proveedores, usuarios, bancos, noticias, tickets, cotizaciones...) tienen
 * decenas o cientos de filas, donde un `seq scan` ya es instantáneo — un
 * índice ahí sería trabajo/espacio sin beneficio real medible, exactamente
 * lo que la tarea pidió evitar.
 */
export class AddSearchNormalizationSupport1760004500000
  implements MigrationInterface
{
  name = 'AddSearchNormalizationSupport1760004500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS unaccent;`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION immutable_unaccent(text)
      RETURNS text AS $$
        SELECT public.unaccent('public.unaccent'::regdictionary, $1)
      $$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION search_normalize(text)
      RETURNS text AS $$
        SELECT lower(immutable_unaccent($1))
      $$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_products_search_name_trgm"
      ON products USING GIN (search_normalize(name) gin_trgm_ops);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_products_search_sku_trgm"
      ON products USING GIN (search_normalize(sku) gin_trgm_ops);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_products_search_sku_trgm";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_products_search_name_trgm";`,
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS search_normalize(text);`);
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS immutable_unaccent(text);`,
    );
    // Las extensiones NO se eliminan — otras funciones/índices podrían
    // depender de ellas para cuando este `down()` se ejecute, y
    // `DROP EXTENSION` es una operación destructiva que esta tarea pidió
    // explícitamente evitar.
  }
}
