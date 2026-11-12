# 09 · Diccionario técnico y de negocio

Volver a la [guía principal](../../CODEBASE_STUDY_GUIDE.md).

## Arquitectura y patrones

| Término | Explicación sencilla | Dónde se ve |
|---|---|---|
| **Clean Architecture** | Separar el código en capas: las reglas de negocio no dependen de la base de datos ni del framework. | `modules/<m>/{domain,application,infrastructure,presentation}` |
| **DDD (Domain-Driven Design)** | Organizar el código según el negocio: cada módulo es un "contexto" con su vocabulario. | Módulos `sales`, `banks`, `cash-control`… |
| **Caso de uso (use case)** | Clase con un método `execute` que realiza **una** acción del negocio. | `application/use-cases/*.use-case.ts` |
| **Puerto (port)** | Interfaz que dice *qué* se necesita (por ejemplo, "guardar un arqueo") sin decir *cómo*. | `domain/repositories/*.repository.ts`, `application/ports/*.port.ts` |
| **Adaptador / implementación** | La clase que cumple el puerto usando una tecnología concreta (TypeORM, bcrypt). | `infrastructure/persistence/typeorm-*.repository.ts` |
| **Token de inyección** | `Symbol('X_REPOSITORY')` con el que Nest sabe qué implementación entregar para una interfaz. | Junto a cada interfaz de repositorio |
| **Inyección de dependencias (DI)** | El framework crea los objetos y entrega sus dependencias en el constructor (`@Inject`) o con `inject()`. | Nest y Angular |
| **Entidad de dominio** | Objeto del negocio con constructor privado y `static create()`. | `domain/entities/*.entity.ts` |
| **Entidad ORM** | Clase con decoradores `@Entity`, `@Column` que TypeORM usa para mapear una tabla. | `*.orm-entity.ts` |
| **Mapper** | Convierte entre entidad ORM y entidad de dominio. | `*.mapper.ts` |
| **DTO** | *Data Transfer Object*: la forma de los datos que entran (request) o salen (response/output). | `presentation/dtos/`, `application/dtos/*-output.ts` |
| **Barrel** | `index.ts` que reexporta varios archivos para importarlos juntos. | `core/models/index.ts`, `shared/ui/index.ts` |
| **Guard** | Código que decide si una ruta puede ejecutarse (sesión, rol). | `JwtAuthGuard`, `RolesGuard`, `authGuard` |
| **Interceptor** | Código que envuelve cada petición o respuesta (agregar token, envolver en `{success,data}`). | `ResponseInterceptor`, `authInterceptor` |
| **Filtro de excepciones** | Convierte cualquier error en una respuesta JSON uniforme. | `GlobalExceptionFilter` |
| **Pipe (Nest)** | Transforma y valida parámetros; `ValidationPipe` aplica las reglas de los DTO. | `main.ts` |
| **Componente standalone** | Componente Angular que declara sus propias dependencias sin NgModule. | Todos los `*.component.ts` |
| **Signal / computed** | Valor reactivo de Angular; `computed` se recalcula cuando cambian las signals de las que depende. | `signal(...)`, `computed(...)` |
| **OnPush** | Estrategia que redibuja un componente solo cuando cambian sus entradas o signals. | `changeDetection: ChangeDetectionStrategy.OnPush` |
| **Store** | Servicio singleton que guarda estado de pantalla entre navegaciones. | `SalesDraftStore`, `BankDepositDraftStore` |
| **Lazy loading** | Cargar una pantalla solo cuando se navega a ella (`loadComponent: () => import(...)`). | `app.routes.ts` |
| **PWA / Service Worker** | Script del navegador para modo sin conexión y notificaciones push. | `provideServiceWorker` en `app.config.ts` |

## Base de datos

| Término | Explicación | Dónde |
|---|---|---|
| **Migración** | Archivo que cambia el esquema de forma versionada (`up`) y lo revierte (`down`). | `src/database/migrations/` |
| **Función PL/pgSQL** | Procedimiento dentro de PostgreSQL; aquí hace las operaciones financieras de forma atómica. | `register_*`, `apply_*`, `close_*` |
| **Trigger** | Función que la base ejecuta sola al insertar o actualizar una tabla. | `trg_cash_bank_deposit_insert`, `trg_*_guard` |
| **Transacción** | Grupo de cambios que se guarda completo o no se guarda. | Cada llamada a función; `TransactionManager` |
| **`FOR UPDATE`** | Bloquea filas hasta terminar la transacción para que nadie las cambie a la vez. | Funciones de venta, banco, día |
| **Advisory lock** | Candado por nombre (`pg_advisory_xact_lock(hashtext('cash_control_main'))`) que serializa operaciones de un mismo recurso lógico. | Kardex de caja y Bodega |
| **Idempotencia** | Repetir la misma solicitud no duplica el efecto (clave `idempotency_key` UNIQUE). | Control de Efectivo, Guayacán, CxC |
| **`RAISE EXCEPTION 'CODIGO:…'`** | Error lanzado desde SQL. El backend lee el código y lo convierte en un error de dominio. | Todas las funciones financieras |
| **PK / FK** | Llave primaria (identifica la fila) / llave foránea (apunta a otra tabla). | Ver [05_DATABASE_REFERENCE.md](05_DATABASE_REFERENCE.md) |
| **CHECK** | Regla que la base valida en cada fila (por ejemplo `subtotal = denomination * quantity`). | Tablas de detalles |
| **Índice parcial** | Índice solo para filas que cumplen una condición (por ejemplo, "un solo corte ABIERTO"). | `UQ_cash_cut_periods_single_open` |
| **NUMERIC(14,2)** | Tipo decimal exacto para dinero (nunca `float`). | Todas las columnas de montos |

## Negocio (términos del dominio)

| Término | Significado en el sistema |
|---|---|
| **Agente bancario** | El comercio realiza depósitos, retiros y pagos en nombre de bancos. Las cuentas están en `banks`. |
| **Banco agente** | Banco con el que se opera en Transaccionar (`transaction_banks`). |
| **Transaccionar** | Pantalla para registrar operaciones bancarias: monto, desglose de efectivo y reparto en sub-transacciones (`bank_deposit_operations`). |
| **Día operativo / apertura del día** | Ciclo diario de Agentes Bancarios (`day_openings`): apertura → saldos → cuadre → cierre. |
| **Cuadre de Agentes** | Cierre diario: efectivo contado + Bodega + bancos + cuentas por cobrar − activos (`agent_reconciliations`). |
| **Kardex** | Libro de movimientos con saldo anterior y posterior. Hay uno de caja (`cash_movements`), uno de Bodega, uno de Guayacán y uno bancario. |
| **Caja** | Efectivo físico del punto de venta (Kardex de caja). |
| **Bodega** | Custodia de efectivo separada de la caja (`warehouse_cash_movements`). |
| **Corte (de caja)** | Cada uno de los 2 periodos diarios de Control de Efectivo (`cash_cut_periods`): "Primer corte · mediodía" y "Segundo corte · final del día". Se cierra con un arqueo. |
| **Arqueo** | Conteo físico de billetes y monedas por denominación, comparado con lo que dice el sistema. |
| **Desglose / denominaciones** | Cantidad por billete o moneda (Q200 … Q0.01). |
| **Faltante / sobrante / cuadrado** | Contado < sistema / contado > sistema / iguales. |
| **CxC (Cuentas por Cobrar)** | Deudas de clientes (`accounts_receivable`): CARGO aumenta, ABONO disminuye. |
| **Activos** | Valores a favor del negocio registrados en `assets` (por ejemplo, retiros enviados a Activos). |
| **Génesis** | Línea de crédito especial (`banks.special_account = 'GENESIS'`) que puede quedar con "saldo a favor" (negativo). |
| **BI Club** | Línea de crédito cuyo saldo representa deuda (rango −límite … 0). |
| **Guayacán** | Cooperativa con su propia caja de efectivo y comisión por transacción (`guayacan_cash_movements`). |
| **Recargas** | Saldo electrónico de operadoras (Claro, Tigo): compras, saldo final y venta del día. |
| **Anulación** | Corrección que nunca borra: marca el original como `ANULADO` y crea el movimiento inverso. |
| **Revisión de días operativos** | Sesión auditada para corregir un día pasado ya cerrado (`financial-day-review`). |
