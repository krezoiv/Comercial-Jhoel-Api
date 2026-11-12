# 01 · Visión general del proyecto

Volver a la [guía principal](../../CODEBASE_STUDY_GUIDE.md).

## 1. Qué es

**Comercial Jhoel** es un sistema de gestión para un comercio (librería, tienda, heladería) que además opera como **agente bancario**. El repositorio contiene dos aplicaciones independientes:

| Carpeta | Aplicación | Tecnología principal |
|---|---|---|
| `comercial-jhoel-api/` | API REST (backend) | NestJS 11 + TypeORM + PostgreSQL 16 |
| `comercial-jhoel-app/` | Aplicación web (frontend) | Angular 19 (componentes *standalone*, *signals*) |

Cada una tiene su propio `package.json`, su propio `CLAUDE.md` (notas técnicas extensas de los autores) y su propio `Dockerfile`. No hay código compartido entre ambas: el contrato entre ellas es HTTP + JSON.

## 2. Tecnologías y versiones (de los `package.json`)

### Backend (`comercial-jhoel-api/package.json`)

| Paquete | Versión | Para qué se usa en el código |
|---|---|---|
| `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express` | ^11.0.1 | Framework: módulos, controladores, inyección de dependencias |
| `@nestjs/typeorm` / `typeorm` | ^11.0.3 / ^1.1.0 | Acceso a datos (entidades ORM, `DataSource.query` para SQL crudo, migraciones) |
| `pg` | ^8.23.0 | Driver de PostgreSQL |
| `@nestjs/config` | ^4.0.4 | Configuración tipada (`src/config/configuration.ts`) |
| `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` | ^11 / ^0.7 / ^4 | Autenticación con JWT (`JwtStrategy`, `JwtAuthGuard`) |
| `bcrypt` | ^6.0.0 | Hash de contraseñas (`BcryptPasswordHasher`) |
| `class-validator`, `class-transformer` | ^0.15.1 / ^0.5.1 | Validación de DTOs con decoradores |
| `@nestjs/throttler` | ^6.5.0 | Límite de intentos (solo en `POST /auth/login`) |
| `helmet` | ^8.3.0 | Cabeceras HTTP de seguridad (`main.ts`) |
| `pdfkit` | ^0.20.1 | Generación de PDF en reportes (`shared/infrastructure/pdf`, `reports`) |
| `exceljs` | ^4.4.0 | Exportación a Excel |
| `web-push` | ^3.6.7 | Notificaciones push de noticias (`news-subscriptions/.../web-push-sender.service.ts`) |

Herramientas de desarrollo: `@nestjs/cli`, `jest` + `ts-jest` + `supertest` (pruebas), `eslint`, `prettier`, `ts-node`, `typescript` 5.9.

### Frontend (`comercial-jhoel-app/package.json`)

| Paquete | Versión | Uso |
|---|---|---|
| `@angular/core`, `common`, `router`, `forms`, `platform-browser` | ^19.2.0 | Framework |
| `@angular/service-worker` | ^19.2.25 | PWA y recepción de Web Push (`app.config.ts`) |
| `@zxing/browser`, `@zxing/library` | ^0.2.1 / ^0.23.0 | Lector de códigos de barras con la cámara (`shared/ui/barcode-scanner-modal`) |
| `rxjs` | ~7.8.0 | Observables de `HttpClient` |
| `zone.js` | ~0.15.0 | Detección de cambios |

Pruebas: Karma + Jasmine (`ng test`).

## 3. Estructura de carpetas

```text
comercial-jhoel/
├── CODEBASE_STUDY_GUIDE.md          ← esta guía de estudio
├── docs/codebase-study/             ← documentación generada + capítulos
├── comercial-jhoel-api/
│   ├── src/
│   │   ├── main.ts                  ← punto de entrada (bootstrap de Nest)
│   │   ├── app.module.ts            ← módulo raíz: importa los 46 módulos de negocio
│   │   ├── config/configuration.ts  ← configuración tipada desde variables de entorno
│   │   ├── database/
│   │   │   ├── data-source.ts       ← DataSource para el CLI de TypeORM y seeds
│   │   │   ├── migrations/          ← 112 migraciones (tablas, funciones PL/pgSQL, triggers)
│   │   │   └── seeds/               ← usuario administrador inicial
│   │   ├── shared/                  ← DomainError, filtro global, interceptor, decoradores, puertos
│   │   ├── health/                  ← GET /api/health
│   │   └── modules/<modulo>/        ← un módulo por contexto de negocio (Clean Architecture)
│   │       ├── domain/              ← entidades, puertos de repositorio, errores, políticas
│   │       ├── application/         ← casos de uso, DTO de salida, utilidades
│   │       ├── infrastructure/      ← repositorios TypeORM, entidades ORM, mappers, servicios
│   │       └── presentation/        ← controladores y DTO de entrada
│   ├── test/                        ← pruebas E2E (supertest) y su runner sobre una copia de la base
│   └── sql/tests/                   ← pruebas SQL (transacción + ROLLBACK) y de concurrencia
└── comercial-jhoel-app/
    └── src/
        ├── main.ts                  ← bootstrapApplication(AppComponent, appConfig)
        ├── environments/            ← apiUrl
        └── app/
            ├── app.config.ts        ← providers: router, HttpClient + interceptores, service worker
            ├── app.routes.ts        ← rutas (carga diferida con loadComponent)
            ├── core/                ← servicios HTTP, stores, modelos, guards, interceptores, utilidades
            ├── shared/              ← componentes de UI reutilizables, directivas, pipes
            ├── layout/              ← navbar, footer del sitio público
            └── features/            ← pantallas: landing, catálogo, login, dashboard/<pantalla>
```

Módulos del backend (`comercial-jhoel-api/src/modules/`): `account-types`, `accounts-receivable`, `alert-settings`, `alerts`, `assets`, `auth`, `bank-deposits`, `banks`, `businesses`, `cash-control`, `catalog`, `catalog-banks`, `categories`, `clients`, `company-settings`, `dashboard`, `financial-day-review`, `guayacan-cash-box`, `ice-creams`, `inventory`, `keyboard-shortcuts`, `landing-backgrounds`, `likes`, `news`, `news-subscriptions`, `news-types`, `phones`, `presentation-types`, `product-catalog`, `products`, `purchases`, `quotations`, `recharge-cash-box`, `recharges`, `reports`, `roles`, `sales`, `sales-cash-box`, `sales-register`, `site-visits`, `suppliers`, `tickets`, `transaction-banks`, `transaction-types`, `units-of-measure`, `users`.

## 4. Puntos de entrada

| Qué | Archivo | Qué hace |
|---|---|---|
| Arranque del backend | `comercial-jhoel-api/src/main.ts` (`bootstrap`) | Crea la app con `NestFactory.create(AppModule)`, aplica `helmet()`, prefijo global `api`, CORS con lista de orígenes (admite comodines `*`), `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`) y escucha en `app.port` (default 3000). |
| Módulo raíz | `comercial-jhoel-api/src/app.module.ts` | `ConfigModule.forRoot` global, `ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }])`, `TypeOrmModule.forRootAsync`, importa todos los módulos y registra `GlobalExceptionFilter` (`APP_FILTER`) y `ResponseInterceptor` (`APP_INTERCEPTOR`). |
| CLI de migraciones | `comercial-jhoel-api/src/database/data-source.ts` | `DataSource` independiente de Nest (lee `process.env` con `dotenv`). |
| Arranque del frontend | `comercial-jhoel-app/src/main.ts` | `bootstrapApplication(AppComponent, appConfig)`. |
| Configuración Angular | `comercial-jhoel-app/src/app/app.config.ts` | `provideRouter(routes)`, `provideHttpClient(withInterceptors([authInterceptor, cashMutationInterceptor]))`, `LOCALE_ID = 'es'`, service worker solo en producción. |
| Rutas | `comercial-jhoel-app/src/app/app.routes.ts` | Rutas públicas (landing, catálogo, noticias, login) y `/dashboard` protegido por `authGuard`, con hijos protegidos por `adminGuard` donde aplica. |

## 5. Variables de entorno (solo nombres; nunca valores)

Leídas por `comercial-jhoel-api/src/config/configuration.ts`, `data-source.ts` y el seed (`.env.example` lista las principales):

| Variable | Uso |
|---|---|
| `NODE_ENV`, `PORT` | Entorno y puerto HTTP |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME` | Conexión a PostgreSQL |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Firma y expiración del token (segundos) |
| `CORS_ORIGINS` | Orígenes permitidos (separados por coma) |
| `FRONTEND_URL` | URL pública del frontend (enlaces en notificaciones) |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Claves de Web Push |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_USERNAME`, `SEED_ADMIN_PHONE`, `SEED_ADMIN_PASSWORD` | Usuario administrador del seed |

El frontend no usa variables de entorno en tiempo de ejecución: su única configuración es `apiUrl` en `src/environments/environment*.ts`.

## 6. Docker y despliegue

- `comercial-jhoel-api/docker-compose.yml`: servicios `postgres` (imagen `postgres:16-alpine`), `api` (etapa `development` del `Dockerfile`, código montado, `nest start --watch`) y `pgadmin`.
- `comercial-jhoel-api/Dockerfile`: etapas `dependencies`, `development`, `build` y `production` (solo `dist/` + dependencias de producción).
- `comercial-jhoel-app/Dockerfile`: compila con `node:22-alpine` y sirve el resultado con **Caddy** (`caddy:2-alpine`, `Caddyfile`).
- Producción: Railway (ver `comercial-jhoel-api/CLAUDE.md`, sección de migraciones en producción).

## 7. Comandos

| Objetivo | Comando (desde la carpeta indicada) |
|---|---|
| Levantar API + Postgres | `comercial-jhoel-api`: `docker compose up -d --build` |
| API en modo desarrollo | `npm run start:dev` |
| Compilar API | `npm run build` |
| Migraciones (dev) | `npm run migration:run` / `npm run migration:revert` |
| Migraciones (producción, sobre `dist/`) | `npm run migration:run:prod` |
| Seed del administrador | `npm run seed:admin` |
| Pruebas unitarias API | `npm run test` |
| Pruebas E2E API | `test/run-cash-control-e2e.sh test/<archivo>.e2e-spec.ts` (copia temporal `<db>_e2e`) |
| Pruebas SQL | `docker compose exec -T postgres psql -U <usuario> -d <db> -v ON_ERROR_STOP=1 < sql/tests/<archivo>.test.sql` |
| Frontend en desarrollo | `comercial-jhoel-app`: `npm start` (`ng serve`) |
| Build de producción del frontend | `npx ng build --configuration production` |
| Pruebas frontend | `npx ng test --watch=false --browsers=ChromeHeadless` |

## 8. Integraciones externas identificadas en el código

- **PostgreSQL**: única base de datos.
- **Web Push (VAPID)**: `web-push` en el backend y `SwPush` + service worker en el frontend (suscripciones a noticias).
- **Cámara del navegador**: lectura de códigos de barras con ZXing.
- **PDF / Excel**: generados en el backend (`pdfkit`, `exceljs`).
- No se encontraron WebSockets, colas ni tareas programadas (`@Cron`). La sincronización entre pestañas del navegador usa `BroadcastChannel` (`core/services/cash-control-sync.service.ts`).

## 9. Tamaño del código analizado

Ver [00_FILE_INVENTORY.md](00_FILE_INVENTORY.md): 2,325 archivos TypeScript, 379 plantillas HTML, 2,143 clases, 5,099 métodos, 604 funciones, 1,496 interfaces, 440 endpoints, 110 tablas y 202 funciones SQL.
