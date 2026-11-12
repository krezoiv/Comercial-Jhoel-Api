# Configuración del backend

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [configuration.ts](#f-comercial-jhoel-api-src-config-configuration-ts) | .ts | Código TypeScript | Arranque / configuración | The single source of typed environment configuration, loaded once via `ConfigModule.forRoot({ isGlobal: true, load: [configuration] })` in `AppModule`. | 0 internas | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-config-configuration-ts"></a>

### configuration.ts

- **Ruta:** [configuration.ts](../../../../comercial-jhoel-api/src/config/configuration.ts) (`comercial-jhoel-api/src/config/configuration.ts`, 71 líneas)
- **Tipo:** Código TypeScript · **Capa:** Arranque / configuración · **Módulo:** Configuración del backend
- **Responsabilidad:** The single source of typed environment configuration, loaded once via `ConfigModule.forRoot({ isGlobal: true, load: [configuration] })` in `AppModule`.
- **Descripción del autor (comentario del archivo):** The single source of typed environment configuration, loaded once via `ConfigModule.forRoot({ isGlobal: true, load: [configuration] })` in `AppModule`. Every module reads env vars through `ConfigService.get(...)` against these namespaces (`'database.host'`, `'jwt.secret'`, etc.) rather than touching `process.env` directly — this is the one file that needs updating when a new environment variable is introduced.
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

**Interfaces, tipos y enums:**

- `interface AppConfig` (L9): The single source of typed environment configuration, loaded once via `ConfigModule.forRoot({ isGlobal: true, load: [configuration] })` in `AppModule`. — miembros: `port`, `environment`, `frontendUrl`
- `interface DatabaseConfig` (L16): sin documentación — miembros: `host`, `port`, `username`, `password`, `name`
- `interface JwtConfig` (L24): sin documentación — miembros: `secret`, `expiresIn`
- `interface CorsConfig` (L29): sin documentación — miembros: `origins`
- `interface PushConfig` (L33): sin documentación — miembros: `vapidPublicKey`, `vapidPrivateKey`, `vapidSubject`
