# Base de datos: data-source y seeds

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [data-source.ts](#f-comercial-jhoel-api-src-database-data-source-ts) | .ts | Código TypeScript | Arranque / configuración | Código TypeScript: declara `AppDataSource` (sin comentario de documentación en el código). | 0 internas; ext.: dotenv, typeorm | 1 | Baja (1 consumidores) |
| [admin-user.seed.ts](#f-comercial-jhoel-api-src-database-seeds-admin-user-seed-ts) | .ts | Seed | Arranque / configuración | Seed: declara `run`, `SALT_ROUNDS` (sin comentario de documentación en el código). | 3 internas; ext.: bcrypt | 0 | Soporte (pruebas) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-database-data-source-ts"></a>

### data-source.ts

- **Ruta:** [data-source.ts](../../../../comercial-jhoel-api/src/database/data-source.ts) (`comercial-jhoel-api/src/database/data-source.ts`, 28 líneas)
- **Tipo:** Código TypeScript · **Capa:** Arranque / configuración · **Módulo:** Base de datos: data-source y seeds
- **Responsabilidad:** Código TypeScript: declara `AppDataSource` (sin comentario de documentación en el código).
- **Paquetes externos:** `dotenv`, `typeorm`
- **Consumidores:** [admin-user.seed.ts](database.md#f-comercial-jhoel-api-src-database-seeds-admin-user-seed-ts)

**Constantes exportadas:**

- `AppDataSource` (L17): `__dirname`-relative, `{ts,js}` globs — NOT hardcoded `src/...` paths — so this same compiled file works correctly in both contexts it actually runs in: via `typeorm-ts-node-commonjs` against the `.ts` sources in dev (`__dirname` = `src/database`), and via plain `node`/`typeorm` against the compiled = `new DataSource({ type: 'postgres', host: process.env.DATABASE_HOST ?? 'localhost', port: parseInt(process.env.`
<a id="f-comercial-jhoel-api-src-database-seeds-admin-user-seed-ts"></a>

### admin-user.seed.ts

- **Ruta:** [admin-user.seed.ts](../../../../comercial-jhoel-api/src/database/seeds/admin-user.seed.ts) (`comercial-jhoel-api/src/database/seeds/admin-user.seed.ts`, 58 líneas)
- **Tipo:** Seed · **Capa:** Arranque / configuración · **Módulo:** Base de datos: data-source y seeds
- **Responsabilidad:** Seed: declara `run`, `SALT_ROUNDS` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [data-source.ts](database.md#f-comercial-jhoel-api-src-database-data-source-ts), [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [role.orm-entity.ts](roles.md#f-comercial-jhoel-api-src-modules-roles-infrastructure-persistence-role-orm-entity-ts)
- **Paquetes externos:** `bcrypt`
- **Consumidores:** —
#### Función `run` (L8–52)

- **Tipo:** función local del archivo, async
- **Firma:** `run(): Promise<void>` — [admin-user.seed.ts](../../../../comercial-jhoel-api/src/database/seeds/admin-user.seed.ts#L8)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `AppDataSource.initialize`, `AppDataSource.getRepository`, `repository.findOne`, `repository.update`, `console.log`, `AppDataSource.destroy`, `roleRepository.findOne`, `new Error`, `bcrypt.hash`, `repository.save`, `repository.create`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `new Error( 'El rol ADMIN no existe — ejecuta las migraciones antes del seed.', )`
- **Consumidores:** uso interno del archivo

