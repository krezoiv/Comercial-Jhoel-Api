# Módulo backend `keyboard-shortcuts`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `POST /api/keyboard-shortcuts` | [keyboard-shortcuts.controller.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts#L49) `KeyboardShortcutsController.create` | [CreateKeyboardShortcutUseCase](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts) | `KeyboardShortcutRepository`.findByActiveCombo/create | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `KeyboardShortcutService.createShortcut` |
| `GET /api/keyboard-shortcuts` | [keyboard-shortcuts.controller.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts#L69) `KeyboardShortcutsController.findAll` | [ListKeyboardShortcutsUseCase](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-list-keyboard-shortcuts-use-case-ts) | `KeyboardShortcutRepository`.findAll | UseGuards(JwtAuthGuard) | `KeyboardShortcutService.getShortcuts` |
| `GET /api/keyboard-shortcuts/:id` | [keyboard-shortcuts.controller.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts#L74) `KeyboardShortcutsController.findOne` | [GetKeyboardShortcutByIdUseCase](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-get-keyboard-shortcut-by-id-use-case-ts) | `KeyboardShortcutRepository`.findById | UseGuards(JwtAuthGuard) | — |
| `PATCH /api/keyboard-shortcuts/:id` | [keyboard-shortcuts.controller.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts#L79) `KeyboardShortcutsController.update` | [UpdateKeyboardShortcutUseCase](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts) | `KeyboardShortcutRepository`.findById/findByActiveCombo/update | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `KeyboardShortcutService.updateShortcut` |
| `DELETE /api/keyboard-shortcuts/:id` | [keyboard-shortcuts.controller.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts#L93) `KeyboardShortcutsController.deactivate` | [DeactivateKeyboardShortcutUseCase](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-deactivate-keyboard-shortcut-use-case-ts) | `KeyboardShortcutRepository`.findById/deactivate | UseGuards(JwtAuthGuard) UseGuards(RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `KeyboardShortcutService.deactivateShortcut` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [keyboard-shortcut-output.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-dtos-keyboard-shortcut-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | DTO de salida (aplicación): declara `toKeyboardShortcutOutput`, `KeyboardShortcutOutput` (sin comentario de documentación en el código). | 1 internas | 4 | Media (4 consumidores) |
| [create-keyboard-shortcut.use-case.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `CreateKeyboardShortcutUseCase`, `CreateKeyboardShortcutInput` (sin comentario de documentación en el código). | 5 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [deactivate-keyboard-shortcut.use-case.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-deactivate-keyboard-shortcut-use-case-ts) | .ts | Caso de uso | Aplicación | Soft delete only — same convention as every other Sistema catalog. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [describe-combo.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-describe-combo-ts) | .ts | Código TypeScript | Aplicación | Human-readable combo for error messages, e.g. | 1 internas | 2 | Baja (2 consumidores) |
| [get-keyboard-shortcut-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-get-keyboard-shortcut-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetKeyboardShortcutByIdUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-keyboard-shortcuts.use-case.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-list-keyboard-shortcuts-use-case-ts) | .ts | Caso de uso | Aplicación | Read by every authenticated role (see the controller) — `KeyboardShortcutsService` needs the full active list regardless of who's logged in, not just admins. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-keyboard-shortcut.use-case.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `UpdateKeyboardShortcutUseCase`, `UpdateKeyboardShortcutInput` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [keyboard-shortcut.entity.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-entities-keyboard-shortcut-entity-ts) | .ts | Entidad de dominio | Dominio | A global keyboard shortcut → dashboard route mapping, configurable from "Sistema → Atajos de Teclado". | 0 internas | 4 | Media (4 consumidores) |
| [invalid-shortcut-modifier.error.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-invalid-shortcut-modifier-error-ts) | .ts | Errores de dominio | Dominio | Mirrors `CHK_keyboard_shortcuts_requires_modifier` — a shortcut with zero modifiers (or only Shift) would shadow ordinary single-key typing everywhere outside a text field. | 1 internas | 3 | Media (3 consumidores) |
| [keyboard-shortcut-combo-already-exists.error.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-keyboard-shortcut-combo-already-exists-error-ts) | .ts | Errores de dominio | Dominio | Two active shortcuts can never share the exact same key + modifiers — whichever the list returned first would win silently, which is never the intent. | 1 internas | 3 | Media (3 consumidores) |
| [keyboard-shortcut-not-found.error.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-keyboard-shortcut-not-found-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `KeyboardShortcutNotFoundError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [keyboard-shortcut.repository.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-repositories-keyboard-shortcut-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `KeyboardShortcutCombo`, `CreateKeyboardShortcutData`, `UpdateKeyboardShortcutData`, `FindKeyboardShortcutsOptions`, `KeyboardShortcutRepository` (sin comentario de documentación en el código). | 1 internas | 8 | Media (8 consumidores) |
| [keyboard-shortcut.mapper.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-keyboard-shortcut-mapper-ts) | .ts | Mapper | Infraestructura | Mapper: declara `KeyboardShortcutMapper` (sin comentario de documentación en el código). | 2 internas | 1 | Baja (1 consumidores) |
| [keyboard-shortcut.orm-entity.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-keyboard-shortcut-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `KeyboardShortcutOrmEntity` (sin comentario de documentación en el código). | 1 internas; ext.: typeorm | 3 | Media (3 consumidores) |
| [typeorm-keyboard-shortcut.repository.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-typeorm-keyboard-shortcut-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmKeyboardShortcutRepository` (sin comentario de documentación en el código). | 6 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [keyboard-shortcuts.module.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-keyboard-shortcuts-module-ts) | .ts | Módulo | Arranque / configuración | Módulo: declara `KeyboardShortcutsModule` (sin comentario de documentación en el código). | 9 internas; ext.: @nestjs/common, @nestjs/typeorm | 1 | Baja (1 consumidores) |
| [keyboard-shortcuts.controller.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts) | .ts | Controlador | Presentación | "Sistema → Atajos de Teclado". | 13 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [create-keyboard-shortcut.request.dto.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-create-keyboard-shortcut-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `CreateKeyboardShortcutRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [keyboard-shortcut.response.dto.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-keyboard-shortcut-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `KeyboardShortcutResponseDto` (sin comentario de documentación en el código). | 0 internas | 1 | Baja (1 consumidores) |
| [list-keyboard-shortcuts.query.dto.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-list-keyboard-shortcuts-query-dto-ts) | .ts | DTO de consulta | Presentación | DTO de consulta: declara `ListKeyboardShortcutsQueryDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-transformer, class-validator | 1 | Baja (1 consumidores) |
| [update-keyboard-shortcut.request.dto.ts](#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-update-keyboard-shortcut-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateKeyboardShortcutRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-dtos-keyboard-shortcut-output-ts"></a>

### keyboard-shortcut-output.ts

- **Ruta:** [keyboard-shortcut-output.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/dtos/keyboard-shortcut-output.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/dtos/keyboard-shortcut-output.ts`, 40 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** DTO de salida (aplicación): declara `toKeyboardShortcutOutput`, `KeyboardShortcutOutput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [keyboard-shortcut.entity.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-entities-keyboard-shortcut-entity-ts)
- **Consumidores:** [create-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts), [get-keyboard-shortcut-by-id.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-get-keyboard-shortcut-by-id-use-case-ts), [list-keyboard-shortcuts.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-list-keyboard-shortcuts-use-case-ts), [update-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts)

**Interfaces, tipos y enums:**

- `interface KeyboardShortcutOutput` (L3): sin documentación — miembros: `id`, `label`, `key`, `altKey`, `ctrlKey`, `shiftKey`, `metaKey`, `route`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`
#### Función `toKeyboardShortcutOutput` (L21–39)

- **Tipo:** función exportada
- **Firma:** `toKeyboardShortcutOutput(shortcut: KeyboardShortcut): KeyboardShortcutOutput` — [keyboard-shortcut-output.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/dtos/keyboard-shortcut-output.ts#L21)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts), [get-keyboard-shortcut-by-id.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-get-keyboard-shortcut-by-id-use-case-ts), [update-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts"></a>

### create-keyboard-shortcut.use-case.ts

- **Ruta:** [create-keyboard-shortcut.use-case.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/create-keyboard-shortcut.use-case.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/create-keyboard-shortcut.use-case.ts`, 55 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Caso de uso: declara `CreateKeyboardShortcutUseCase`, `CreateKeyboardShortcutInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-repositories-keyboard-shortcut-repository-ts), [keyboard-shortcut-combo-already-exists.error.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-keyboard-shortcut-combo-already-exists-error-ts), [invalid-shortcut-modifier.error.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-invalid-shortcut-modifier-error-ts), [describe-combo.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-describe-combo-ts), [keyboard-shortcut-output.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-dtos-keyboard-shortcut-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [keyboard-shortcuts.module.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-keyboard-shortcuts-module-ts), [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

**Interfaces, tipos y enums:**

- `interface CreateKeyboardShortcutInput` (L9): sin documentación — miembros: `label`, `key`, `altKey`, `ctrlKey`, `shiftKey`, `metaKey`, `route`, `createdBy`

#### Clase `CreateKeyboardShortcutUseCase` (L20–54)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(KEYBOARD_SHORTCUT_REPOSITORY) keyboardShortcutRepository: KeyboardShortcutRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 27–53 | `input: CreateKeyboardShortcutInput` | `Promise<KeyboardShortcutOutput>` |

##### `CreateKeyboardShortcutUseCase.execute`

- **Firma:** `execute(input: CreateKeyboardShortcutInput): Promise<KeyboardShortcutOutput>` — [create-keyboard-shortcut.use-case.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/create-keyboard-shortcut.use-case.ts#L27) (L27–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new InvalidShortcutModifierError`, `input.label.trim().replace`, `input.label.trim`, `input.key.trim`, `this.keyboardShortcutRepository.findByActiveCombo`, `new KeyboardShortcutComboAlreadyExistsError`, `describeCombo`, `this.keyboardShortcutRepository.create`, `input.route.trim`, `toKeyboardShortcutOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new InvalidShortcutModifierError()`, `new KeyboardShortcutComboAlreadyExistsError(describeCombo(combo))`
- **Consumidores:** [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-deactivate-keyboard-shortcut-use-case-ts"></a>

### deactivate-keyboard-shortcut.use-case.ts

- **Ruta:** [deactivate-keyboard-shortcut.use-case.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/deactivate-keyboard-shortcut.use-case.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/deactivate-keyboard-shortcut.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Soft delete only — same convention as every other Sistema catalog.
- **Depende de (archivos del proyecto):** [keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-repositories-keyboard-shortcut-repository-ts), [keyboard-shortcut-not-found.error.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-keyboard-shortcut-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [keyboard-shortcuts.module.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-keyboard-shortcuts-module-ts), [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

#### Clase `DeactivateKeyboardShortcutUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft delete only — same convention as every other Sistema catalog.
- **Dependencias inyectadas (constructor):** `@Inject(KEYBOARD_SHORTCUT_REPOSITORY) keyboardShortcutRepository: KeyboardShortcutRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<void>` |

##### `DeactivateKeyboardShortcutUseCase.execute`

- **Firma:** `execute(id: string): Promise<void>` — [deactivate-keyboard-shortcut.use-case.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/deactivate-keyboard-shortcut.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.keyboardShortcutRepository.findById`, `new KeyboardShortcutNotFoundError`, `this.keyboardShortcutRepository.deactivate`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new KeyboardShortcutNotFoundError(id)`
- **Consumidores:** [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-describe-combo-ts"></a>

### describe-combo.ts

- **Ruta:** [describe-combo.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/describe-combo.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/describe-combo.ts`, 13 líneas)
- **Tipo:** Código TypeScript · **Capa:** Aplicación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Human-readable combo for error messages, e.g.
- **Depende de (archivos del proyecto):** [keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-repositories-keyboard-shortcut-repository-ts)
- **Consumidores:** [create-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts), [update-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts)
#### Función `describeCombo` (L4–12)

- **Tipo:** función exportada
- **Firma:** `describeCombo(combo: KeyboardShortcutCombo): string` — [describe-combo.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/describe-combo.ts#L4)
- **Propósito / descripción:** Human-readable combo for error messages, e.g. `Alt + F11` — never duplicated inline in both create/update use cases.
- **Dependencias:** `parts.push`, `combo.key.toUpperCase`, `parts.join`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts), [update-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-get-keyboard-shortcut-by-id-use-case-ts"></a>

### get-keyboard-shortcut-by-id.use-case.ts

- **Ruta:** [get-keyboard-shortcut-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/get-keyboard-shortcut-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/get-keyboard-shortcut-by-id.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Caso de uso: declara `GetKeyboardShortcutByIdUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-repositories-keyboard-shortcut-repository-ts), [keyboard-shortcut-not-found.error.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-keyboard-shortcut-not-found-error-ts), [keyboard-shortcut-output.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-dtos-keyboard-shortcut-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [keyboard-shortcuts.module.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-keyboard-shortcuts-module-ts), [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

#### Clase `GetKeyboardShortcutByIdUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(KEYBOARD_SHORTCUT_REPOSITORY) keyboardShortcutRepository: KeyboardShortcutRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `id: string` | `Promise<KeyboardShortcutOutput>` |

##### `GetKeyboardShortcutByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<KeyboardShortcutOutput>` — [get-keyboard-shortcut-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/get-keyboard-shortcut-by-id.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.keyboardShortcutRepository.findById`, `new KeyboardShortcutNotFoundError`, `toKeyboardShortcutOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new KeyboardShortcutNotFoundError(id)`
- **Consumidores:** [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-list-keyboard-shortcuts-use-case-ts"></a>

### list-keyboard-shortcuts.use-case.ts

- **Ruta:** [list-keyboard-shortcuts.use-case.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/list-keyboard-shortcuts.use-case.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/list-keyboard-shortcuts.use-case.ts`, 25 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Read by every authenticated role (see the controller) — `KeyboardShortcutsService` needs the full active list regardless of who's logged in, not just admins.
- **Depende de (archivos del proyecto):** [keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-repositories-keyboard-shortcut-repository-ts), [keyboard-shortcut-output.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-dtos-keyboard-shortcut-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [keyboard-shortcuts.module.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-keyboard-shortcuts-module-ts), [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

**Interfaces, tipos y enums:**

- `interface ListKeyboardShortcutsInput` (L6): sin documentación — miembros: `includeInactive`

#### Clase `ListKeyboardShortcutsUseCase` (L11–24)

- **Decoradores:** `@Injectable()`
- **Propósito:** Read by every authenticated role (see the controller) — `KeyboardShortcutsService` needs the full active list regardless of who's logged in, not just admins.
- **Dependencias inyectadas (constructor):** `@Inject(KEYBOARD_SHORTCUT_REPOSITORY) keyboardShortcutRepository: KeyboardShortcutRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 18–23 | `input?: ListKeyboardShortcutsInput` | `Promise<KeyboardShortcutOutput[]>` |

##### `ListKeyboardShortcutsUseCase.execute`

- **Firma:** `execute(input?: ListKeyboardShortcutsInput): Promise<KeyboardShortcutOutput[]>` — [list-keyboard-shortcuts.use-case.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/list-keyboard-shortcuts.use-case.ts#L18) (L18–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.keyboardShortcutRepository.findAll`, `shortcuts.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts"></a>

### update-keyboard-shortcut.use-case.ts

- **Ruta:** [update-keyboard-shortcut.use-case.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/update-keyboard-shortcut.use-case.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/update-keyboard-shortcut.use-case.ts`, 77 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Caso de uso: declara `UpdateKeyboardShortcutUseCase`, `UpdateKeyboardShortcutInput` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-repositories-keyboard-shortcut-repository-ts), [keyboard-shortcut-not-found.error.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-keyboard-shortcut-not-found-error-ts), [keyboard-shortcut-combo-already-exists.error.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-keyboard-shortcut-combo-already-exists-error-ts), [invalid-shortcut-modifier.error.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-invalid-shortcut-modifier-error-ts), [describe-combo.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-describe-combo-ts), [keyboard-shortcut-output.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-dtos-keyboard-shortcut-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [keyboard-shortcuts.module.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-keyboard-shortcuts-module-ts), [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

**Interfaces, tipos y enums:**

- `interface UpdateKeyboardShortcutInput` (L10): sin documentación — miembros: `label`, `key`, `altKey`, `ctrlKey`, `shiftKey`, `metaKey`, `route`, `isActive`, `updatedBy`

#### Clase `UpdateKeyboardShortcutUseCase` (L22–76)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(KEYBOARD_SHORTCUT_REPOSITORY) keyboardShortcutRepository: KeyboardShortcutRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 29–75 | `id: string`, `input: UpdateKeyboardShortcutInput` | `Promise<KeyboardShortcutOutput>` |

##### `UpdateKeyboardShortcutUseCase.execute`

- **Firma:** `execute(id: string, input: UpdateKeyboardShortcutInput): Promise<KeyboardShortcutOutput>` — [update-keyboard-shortcut.use-case.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/update-keyboard-shortcut.use-case.ts#L29) (L29–75)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.keyboardShortcutRepository.findById`, `new KeyboardShortcutNotFoundError`, `input.key?.trim`, `new InvalidShortcutModifierError`, `combo.key.toLowerCase`, `shortcut.key.toLowerCase`, `this.keyboardShortcutRepository.findByActiveCombo`, `new KeyboardShortcutComboAlreadyExistsError`, `describeCombo`, `input.label?.trim().replace`, `input.label?.trim`, `this.keyboardShortcutRepository.update`, `input.route.trim`, `toKeyboardShortcutOutput`
- **Efectos secundarios:** Actualiza estado (signals): `this.keyboardShortcutRepository.update`
- **Errores que lanza:** `new KeyboardShortcutNotFoundError(id)`, `new InvalidShortcutModifierError()`, `new KeyboardShortcutComboAlreadyExistsError(describeCombo(combo))`
- **Consumidores:** [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-entities-keyboard-shortcut-entity-ts"></a>

### keyboard-shortcut.entity.ts

- **Ruta:** [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts`, 100 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** A global keyboard shortcut → dashboard route mapping, configurable from "Sistema → Atajos de Teclado".
- **Consumidores:** [keyboard-shortcut-output.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-dtos-keyboard-shortcut-output-ts), [keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-repositories-keyboard-shortcut-repository-ts), [keyboard-shortcut.mapper.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-keyboard-shortcut-mapper-ts), [typeorm-keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-typeorm-keyboard-shortcut-repository-ts)

**Interfaces, tipos y enums:**

- `interface KeyboardShortcutProps` (L1): sin documentación — miembros: `id`, `label`, `key`, `altKey`, `ctrlKey`, `shiftKey`, `metaKey`, `route`, `isActive`, `createdAt`, `updatedAt`, `createdBy`, `createdByUsername`, `updatedBy`, `updatedByUsername`

#### Clase `KeyboardShortcut` (L28–99)

- **Propósito:** A global keyboard shortcut → dashboard route mapping, configurable from "Sistema → Atajos de Teclado". Read by `KeyboardShortcutsService` (frontend) to drive `Router.navigateByUrl` — this entity itself has no awareness of navigation, guards, or the frontend at all, same separation every other Sistema catalog (Categorías, Tipos de Transacción...) keeps.
- **Dependencias inyectadas (constructor):** `props: KeyboardShortcutProps`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public static | 31–33 | `props: KeyboardShortcutProps` | `KeyboardShortcut` |
| `id` | getter public | 35–37 | — | `string` |
| `label` | getter public | 39–41 | — | `string` |
| `key` | getter public | 43–45 | — | `string` |
| `altKey` | getter public | 47–49 | — | `boolean` |
| `ctrlKey` | getter public | 51–53 | — | `boolean` |
| `shiftKey` | getter public | 55–57 | — | `boolean` |
| `metaKey` | getter public | 59–61 | — | `boolean` |
| `route` | getter public | 63–65 | — | `string` |
| `isActive` | getter public | 67–69 | — | `boolean` |
| `createdAt` | getter public | 71–73 | — | `Date` |
| `updatedAt` | getter public | 75–77 | — | `Date` |
| `createdBy` | getter public | 79–81 | — | `string` |
| `createdByUsername` | getter public | 83–85 | — | `string` |
| `updatedBy` | getter public | 87–89 | — | `string \| null` |
| `updatedByUsername` | getter public | 91–93 | — | `string \| null` |
| `hasRequiredModifier` | método public | 96–98 | — | `boolean` |

##### `KeyboardShortcut.create`

- **Firma:** `create(props: KeyboardShortcutProps): KeyboardShortcut` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L31) (L31–33)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new KeyboardShortcut`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [keyboard-shortcut.mapper.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-keyboard-shortcut-mapper-ts), [typeorm-keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-typeorm-keyboard-shortcut-repository-ts)

##### `KeyboardShortcut.id`

- **Firma:** `id(): string` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L35) (L35–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.label`

- **Firma:** `label(): string` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L39) (L39–41)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.key`

- **Firma:** `key(): string` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.altKey`

- **Firma:** `altKey(): boolean` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L47) (L47–49)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.ctrlKey`

- **Firma:** `ctrlKey(): boolean` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L51) (L51–53)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.shiftKey`

- **Firma:** `shiftKey(): boolean` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L55) (L55–57)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.metaKey`

- **Firma:** `metaKey(): boolean` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L59) (L59–61)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.route`

- **Firma:** `route(): string` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L63) (L63–65)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.isActive`

- **Firma:** `isActive(): boolean` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L67) (L67–69)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.createdAt`

- **Firma:** `createdAt(): Date` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L71) (L71–73)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.updatedAt`

- **Firma:** `updatedAt(): Date` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L75) (L75–77)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.createdBy`

- **Firma:** `createdBy(): string` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L79) (L79–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.createdByUsername`

- **Firma:** `createdByUsername(): string` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L83) (L83–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.updatedBy`

- **Firma:** `updatedBy(): string \| null` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L87) (L87–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.updatedByUsername`

- **Firma:** `updatedByUsername(): string \| null` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L91) (L91–93)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcut.hasRequiredModifier`

- **Firma:** `hasRequiredModifier(): boolean` — [keyboard-shortcut.entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/entities/keyboard-shortcut.entity.ts#L96) (L96–98)
- **Propósito / descripción:** Mirrors `CHK_keyboard_shortcuts_requires_modifier` — Shift alone never counts (Shift+letter is normal typing for a capital letter).
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-invalid-shortcut-modifier-error-ts"></a>

### invalid-shortcut-modifier.error.ts

- **Ruta:** [invalid-shortcut-modifier.error.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/errors/invalid-shortcut-modifier.error.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/errors/invalid-shortcut-modifier.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Mirrors `CHK_keyboard_shortcuts_requires_modifier` — a shortcut with zero modifiers (or only Shift) would shadow ordinary single-key typing everywhere outside a text field.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts), [update-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts), [typeorm-keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-typeorm-keyboard-shortcut-repository-ts)

#### Clase `InvalidShortcutModifierError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Mirrors `CHK_keyboard_shortcuts_requires_modifier` — a shortcut with zero modifiers (or only Shift) would shadow ordinary single-key typing everywhere outside a text field.
<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-keyboard-shortcut-combo-already-exists-error-ts"></a>

### keyboard-shortcut-combo-already-exists.error.ts

- **Ruta:** [keyboard-shortcut-combo-already-exists.error.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/errors/keyboard-shortcut-combo-already-exists.error.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/errors/keyboard-shortcut-combo-already-exists.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Two active shortcuts can never share the exact same key + modifiers — whichever the list returned first would win silently, which is never the intent.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [create-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts), [update-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts), [typeorm-keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-typeorm-keyboard-shortcut-repository-ts)

#### Clase `KeyboardShortcutComboAlreadyExistsError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Two active shortcuts can never share the exact same key + modifiers — whichever the list returned first would win silently, which is never the intent.
- **Dependencias inyectadas (constructor):** `combo: string`
<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-keyboard-shortcut-not-found-error-ts"></a>

### keyboard-shortcut-not-found.error.ts

- **Ruta:** [keyboard-shortcut-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/errors/keyboard-shortcut-not-found.error.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/errors/keyboard-shortcut-not-found.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Errores de dominio: declara `KeyboardShortcutNotFoundError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [deactivate-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-deactivate-keyboard-shortcut-use-case-ts), [get-keyboard-shortcut-by-id.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-get-keyboard-shortcut-by-id-use-case-ts), [update-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts)

#### Clase `KeyboardShortcutNotFoundError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `identifier: string`
<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-repositories-keyboard-shortcut-repository-ts"></a>

### keyboard-shortcut.repository.ts

- **Ruta:** [keyboard-shortcut.repository.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/repositories/keyboard-shortcut.repository.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/repositories/keyboard-shortcut.repository.ts`, 44 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `KeyboardShortcutCombo`, `CreateKeyboardShortcutData`, `UpdateKeyboardShortcutData`, `FindKeyboardShortcutsOptions`, `KeyboardShortcutRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [keyboard-shortcut.entity.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-entities-keyboard-shortcut-entity-ts)
- **Consumidores:** [create-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts), [deactivate-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-deactivate-keyboard-shortcut-use-case-ts), [describe-combo.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-describe-combo-ts), [get-keyboard-shortcut-by-id.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-get-keyboard-shortcut-by-id-use-case-ts), [list-keyboard-shortcuts.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-list-keyboard-shortcuts-use-case-ts), [update-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts), [typeorm-keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-typeorm-keyboard-shortcut-repository-ts), [keyboard-shortcuts.module.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-keyboard-shortcuts-module-ts)

**Interfaces, tipos y enums:**

- `interface KeyboardShortcutCombo` (L5): sin documentación — miembros: `key`, `altKey`, `ctrlKey`, `shiftKey`, `metaKey`
- `interface CreateKeyboardShortcutData` (L13) extends KeyboardShortcutCombo: sin documentación — miembros: `label`, `route`, `createdBy`
- `interface UpdateKeyboardShortcutData` (L19): sin documentación — miembros: `label`, `key`, `altKey`, `ctrlKey`, `shiftKey`, `metaKey`, `route`, `isActive`, `updatedBy`
- `interface FindKeyboardShortcutsOptions` (L31): sin documentación — miembros: `activeOnly`
- `interface KeyboardShortcutRepository` (L35): sin documentación — miembros: `findAll`, `findById`, `findByActiveCombo`, `create`, `update`, `deactivate`

**Constantes exportadas:**

- `KEYBOARD_SHORTCUT_REPOSITORY` (L3) = `Symbol('KEYBOARD_SHORTCUT_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-keyboard-shortcut-mapper-ts"></a>

### keyboard-shortcut.mapper.ts

- **Ruta:** [keyboard-shortcut.mapper.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/keyboard-shortcut.mapper.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/keyboard-shortcut.mapper.ts`, 25 líneas)
- **Tipo:** Mapper · **Capa:** Infraestructura · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Mapper: declara `KeyboardShortcutMapper` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [keyboard-shortcut.entity.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-entities-keyboard-shortcut-entity-ts), [keyboard-shortcut.orm-entity.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-keyboard-shortcut-orm-entity-ts)
- **Consumidores:** [typeorm-keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-typeorm-keyboard-shortcut-repository-ts)

#### Clase `KeyboardShortcutMapper` (L4–24)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `toDomain` | método public static | 5–23 | `orm: KeyboardShortcutOrmEntity` | `KeyboardShortcut` |

##### `KeyboardShortcutMapper.toDomain`

- **Firma:** `toDomain(orm: KeyboardShortcutOrmEntity): KeyboardShortcut` — [keyboard-shortcut.mapper.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/keyboard-shortcut.mapper.ts#L5) (L5–23)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `KeyboardShortcut.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [typeorm-keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-typeorm-keyboard-shortcut-repository-ts)

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-keyboard-shortcut-orm-entity-ts"></a>

### keyboard-shortcut.orm-entity.ts

- **Ruta:** [keyboard-shortcut.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/keyboard-shortcut.orm-entity.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/keyboard-shortcut.orm-entity.ts`, 66 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `KeyboardShortcutOrmEntity` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [keyboard-shortcut.mapper.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-keyboard-shortcut-mapper-ts), [typeorm-keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-typeorm-keyboard-shortcut-repository-ts), [keyboard-shortcuts.module.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-keyboard-shortcuts-module-ts)

#### Clase `KeyboardShortcutOrmEntity` (L17–65)

- **Decoradores:** `@Entity('keyboard_shortcuts')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column label: string`, `@Column key: string`, `@Column altKey: boolean`, `@Column ctrlKey: boolean`, `@Column shiftKey: boolean`, `@Column metaKey: boolean`, `@Column route: string`, `@Column isActive: boolean`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`, `@Column createdBy: string`, `@ManyToOne createdByUser: UserOrmEntity`, `@Column updatedBy: string \| null`, `@ManyToOne updatedByUser: UserOrmEntity \| null`
<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-typeorm-keyboard-shortcut-repository-ts"></a>

### typeorm-keyboard-shortcut.repository.ts

- **Ruta:** [typeorm-keyboard-shortcut.repository.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts`, 99 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmKeyboardShortcutRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [keyboard-shortcut.entity.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-entities-keyboard-shortcut-entity-ts), [keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-repositories-keyboard-shortcut-repository-ts), [keyboard-shortcut-combo-already-exists.error.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-keyboard-shortcut-combo-already-exists-error-ts), [invalid-shortcut-modifier.error.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-errors-invalid-shortcut-modifier-error-ts), [keyboard-shortcut.orm-entity.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-keyboard-shortcut-orm-entity-ts), [keyboard-shortcut.mapper.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-keyboard-shortcut-mapper-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [keyboard-shortcuts.module.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-keyboard-shortcuts-module-ts)

#### Clase `TypeOrmKeyboardShortcutRepository` (L17–98)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements KeyboardShortcutRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(KeyboardShortcutOrmEntity) repository: Repository<KeyboardShortcutOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public async | 24–30 | `options: FindKeyboardShortcutsOptions` | `Promise<KeyboardShortcut[]>` |
| `findById` | método public async | 32–35 | `id: string` | `Promise<KeyboardShortcut \| null>` |
| `findByActiveCombo` | método public async | 37–48 | `combo: KeyboardShortcutCombo` | `Promise<KeyboardShortcut \| null>` |
| `create` | método public async | 50–68 | `data: CreateKeyboardShortcutData` | `Promise<KeyboardShortcut>` |
| `update` | método public async | 70–79 | `id: string`, `data: UpdateKeyboardShortcutData` | `Promise<KeyboardShortcut>` |
| `deactivate` | método public async | 81–83 | `id: string` | `Promise<void>` |
| `translateConstraintViolation` | método private | 86–97 | `error: unknown` | `unknown` |

##### `TypeOrmKeyboardShortcutRepository.findAll`

- **Firma:** `findAll(options: FindKeyboardShortcutsOptions): Promise<KeyboardShortcut[]>` — [typeorm-keyboard-shortcut.repository.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts#L24) (L24–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`, `KeyboardShortcutMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmKeyboardShortcutRepository.findById`

- **Firma:** `findById(id: string): Promise<KeyboardShortcut \| null>` — [typeorm-keyboard-shortcut.repository.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts#L32) (L32–35)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `KeyboardShortcutMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmKeyboardShortcutRepository.findByActiveCombo`

- **Firma:** `findByActiveCombo(combo: KeyboardShortcutCombo): Promise<KeyboardShortcut \| null>` — [typeorm-keyboard-shortcut.repository.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts#L37) (L37–48)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('shortcut').where`, `this.repository.createQueryBuilder`, `KeyboardShortcutMapper.toDomain`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmKeyboardShortcutRepository.create`

- **Firma:** `create(data: CreateKeyboardShortcutData): Promise<KeyboardShortcut>` — [typeorm-keyboard-shortcut.repository.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts#L50) (L50–68)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.create`, `this.repository.save`, `this.repository.findOneOrFail`, `KeyboardShortcutMapper.toDomain`, `this.translateConstraintViolation`
- **Efectos secundarios:** Escribe vía repositorio TypeORM
- **Errores que lanza:** `this.translateConstraintViolation(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmKeyboardShortcutRepository.update`

- **Firma:** `update(id: string, data: UpdateKeyboardShortcutData): Promise<KeyboardShortcut>` — [typeorm-keyboard-shortcut.repository.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts#L70) (L70–79)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`, `this.translateConstraintViolation`, `this.repository.findOneOrFail`, `KeyboardShortcutMapper.toDomain`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Errores que lanza:** `this.translateConstraintViolation(error)`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmKeyboardShortcutRepository.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [typeorm-keyboard-shortcut.repository.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts#L81) (L81–83)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmKeyboardShortcutRepository.translateConstraintViolation`

- **Firma:** `translateConstraintViolation(error: unknown): unknown` — [typeorm-keyboard-shortcut.repository.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts#L86) (L86–97)
- **Propósito / descripción:** Safety net for the create/update race the use case's own pre-check can't close — same reasoning as `TypeOrmTransactionTypeRepository.translateUniqueViolation`.
- **Dependencias (llamadas en su cuerpo):** `new KeyboardShortcutComboAlreadyExistsError`, `new InvalidShortcutModifierError`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-keyboard-shortcuts-module-ts"></a>

### keyboard-shortcuts.module.ts

- **Ruta:** [keyboard-shortcuts.module.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/keyboard-shortcuts.module.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/keyboard-shortcuts.module.ts`, 29 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** Módulo: declara `KeyboardShortcutsModule` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [keyboard-shortcut.orm-entity.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-keyboard-shortcut-orm-entity-ts), [typeorm-keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-infrastructure-persistence-typeorm-keyboard-shortcut-repository-ts), [keyboard-shortcut.repository.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-domain-repositories-keyboard-shortcut-repository-ts), [create-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts), [list-keyboard-shortcuts.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-list-keyboard-shortcuts-use-case-ts), [get-keyboard-shortcut-by-id.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-get-keyboard-shortcut-by-id-use-case-ts), [update-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts), [deactivate-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-deactivate-keyboard-shortcut-use-case-ts), [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts)

#### Clase `KeyboardShortcutsModule` (L13–28)

- **Decoradores:** `@Module({ imports: [TypeOrmModule.forFeature([KeyboardShortcutOrmEntity])], controllers: [KeyboardShortcutsController], providers: [ { provide: KEYBOARD_SHORTCUT`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts"></a>

### keyboard-shortcuts.controller.ts

- **Ruta:** [keyboard-shortcuts.controller.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts`, 101 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** "Sistema → Atajos de Teclado".
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [create-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-create-keyboard-shortcut-use-case-ts), [list-keyboard-shortcuts.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-list-keyboard-shortcuts-use-case-ts), [get-keyboard-shortcut-by-id.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-get-keyboard-shortcut-by-id-use-case-ts), [update-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-update-keyboard-shortcut-use-case-ts), [deactivate-keyboard-shortcut.use-case.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-application-use-cases-deactivate-keyboard-shortcut-use-case-ts), [create-keyboard-shortcut.request.dto.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-create-keyboard-shortcut-request-dto-ts), [update-keyboard-shortcut.request.dto.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-update-keyboard-shortcut-request-dto-ts), [list-keyboard-shortcuts.query.dto.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-list-keyboard-shortcuts-query-dto-ts), [keyboard-shortcut.response.dto.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-keyboard-shortcut-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [keyboard-shortcuts.module.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-keyboard-shortcuts-module-ts)

#### Clase `KeyboardShortcutsController` (L38–100)

- **Decoradores:** `@UseGuards(JwtAuthGuard)` `@Controller('keyboard-shortcuts')`
- **Propósito:** "Sistema → Atajos de Teclado". CRUD is admin-only (create/update/ deactivate), same policy as every other Sistema catalog — but `GET` stays open to any authenticated role, because the frontend's own `KeyboardShortcutsService` must be able to fetch and use every active shortcut regardless of who's logged in, not just admins who can manage them (identical reasoning to `TransactionTypesController`'s own read/ write split).
- **Dependencias inyectadas (constructor):** `createKeyboardShortcutUseCase: CreateKeyboardShortcutUseCase`, `listKeyboardShortcutsUseCase: ListKeyboardShortcutsUseCase`, `getKeyboardShortcutByIdUseCase: GetKeyboardShortcutByIdUseCase`, `updateKeyboardShortcutUseCase: UpdateKeyboardShortcutUseCase`, `deactivateKeyboardShortcutUseCase: DeactivateKeyboardShortcutUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `create` | método public | 49–67 | `dto: CreateKeyboardShortcutRequestDto`, `userId: string` | `Promise<KeyboardShortcutResponseDto>` |
| `findAll` | método public | 69–72 | `query: ListKeyboardShortcutsQueryDto` | `Promise<KeyboardShortcutResponseDto[]>` |
| `findOne` | método public | 74–77 | `id: string` | `Promise<KeyboardShortcutResponseDto>` |
| `update` | método public | 79–91 | `id: string`, `dto: UpdateKeyboardShortcutRequestDto`, `userId: string` | `Promise<KeyboardShortcutResponseDto>` |
| `deactivate` | método public | 93–99 | `id: string` | `Promise<void>` |

##### `KeyboardShortcutsController.create`

- **Firma:** `create(dto: CreateKeyboardShortcutRequestDto, userId: string): Promise<KeyboardShortcutResponseDto>` — [keyboard-shortcuts.controller.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts#L49) (L49–67)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Post()` `@HttpCode(HttpStatus.CREATED)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.createKeyboardShortcutUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcutsController.findAll`

- **Firma:** `findAll(query: ListKeyboardShortcutsQueryDto): Promise<KeyboardShortcutResponseDto[]>` — [keyboard-shortcuts.controller.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts#L69) (L69–72)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query() query`
- **Dependencias (llamadas en su cuerpo):** `this.listKeyboardShortcutsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcutsController.findOne`

- **Firma:** `findOne(id: string): Promise<KeyboardShortcutResponseDto>` — [keyboard-shortcuts.controller.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts#L74) (L74–77)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getKeyboardShortcutByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcutsController.update`

- **Firma:** `update(id: string, dto: UpdateKeyboardShortcutRequestDto, userId: string): Promise<KeyboardShortcutResponseDto>` — [keyboard-shortcuts.controller.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts#L79) (L79–91)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Patch(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@Body() dto`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.updateKeyboardShortcutUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `KeyboardShortcutsController.deactivate`

- **Firma:** `deactivate(id: string): Promise<void>` — [keyboard-shortcuts.controller.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts#L93) (L93–99)
- **Decoradores:** `@UseGuards(RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.deactivateKeyboardShortcutUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-create-keyboard-shortcut-request-dto-ts"></a>

### create-keyboard-shortcut.request.dto.ts

- **Ruta:** [create-keyboard-shortcut.request.dto.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/dtos/create-keyboard-shortcut.request.dto.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/dtos/create-keyboard-shortcut.request.dto.ts`, 38 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** DTO de entrada: declara `CreateKeyboardShortcutRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

#### Clase `CreateKeyboardShortcutRequestDto` (L3–37)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-keyboard-shortcut-response-dto-ts"></a>

### keyboard-shortcut.response.dto.ts

- **Ruta:** [keyboard-shortcut.response.dto.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/dtos/keyboard-shortcut.response.dto.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/dtos/keyboard-shortcut.response.dto.ts`, 18 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** DTO de respuesta: declara `KeyboardShortcutResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

#### Clase `KeyboardShortcutResponseDto` (L1–17)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-list-keyboard-shortcuts-query-dto-ts"></a>

### list-keyboard-shortcuts.query.dto.ts

- **Ruta:** [list-keyboard-shortcuts.query.dto.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/dtos/list-keyboard-shortcuts.query.dto.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/dtos/list-keyboard-shortcuts.query.dto.ts`, 10 líneas)
- **Tipo:** DTO de consulta · **Capa:** Presentación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** DTO de consulta: declara `ListKeyboardShortcutsQueryDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-transformer`, `class-validator`
- **Consumidores:** [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

#### Clase `ListKeyboardShortcutsQueryDto` (L4–9)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-dtos-update-keyboard-shortcut-request-dto-ts"></a>

### update-keyboard-shortcut.request.dto.ts

- **Ruta:** [update-keyboard-shortcut.request.dto.ts](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/dtos/update-keyboard-shortcut.request.dto.ts) (`comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/dtos/update-keyboard-shortcut.request.dto.ts`, 46 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `keyboard-shortcuts`
- **Responsabilidad:** DTO de entrada: declara `UpdateKeyboardShortcutRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [keyboard-shortcuts.controller.ts](keyboard-shortcuts.md#f-comercial-jhoel-api-src-modules-keyboard-shortcuts-presentation-controllers-keyboard-shortcuts-controller-ts)

#### Clase `UpdateKeyboardShortcutRequestDto` (L4–45)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
