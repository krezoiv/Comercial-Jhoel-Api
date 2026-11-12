# PATCH /api/keyboard-shortcuts/:id

Módulo: **Atajos de teclado (keyboard-shortcuts)** · Fuente editable: [`patch-keyboard-shortcuts-id.mmd`](patch-keyboard-shortcuts-id.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta PATCH /api/keyboard-shortcuts/:id"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["KeyboardShortcutService.updateShortcut<br/><small>app/core/services/keyboard-shortcut.service.ts</small>"]
  n6["KeyboardShortcutsPageComponent.submit<br/><small>app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["KeyboardShortcutsPageComponent.toggleActive<br/><small>app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts</small><br/>(se invoca desde su plantilla)"]
  n8["HTTP PATCH /api/keyboard-shortcuts/:id<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n9["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s10["API NestJS — presentación"]
  n11{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n12(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n13{"¿Rol en @Roles('ADMIN', 'SUPER_ADMIN')?<br/>(RolesGuard)"}
  n14(["403 Sin permisos"])
  n15{"¿UpdateKeyboardShortcutRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n16(["400 Datos inválidos"])
  n17["KeyboardShortcutsController.update<br/><small>api/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts</small>"]
  end
  subgraph s18["Aplicación — caso de uso"]
  n19["UpdateKeyboardShortcutUseCase.execute<br/><small>api/keyboard-shortcuts/application/use-cases/update-keyboard-shortcut.use-case.ts</small>"]
  n20{"¿!shortcut?<br/><small>L31</small>"}
  n21(["KeyboardShortcutNotFoundError(id)"])
  n22{"¿!combo.altKey #amp;#amp; !combo.ctrlKey #amp;#amp; !combo.metaKey?<br/><small>L42</small>"}
  n23(["InvalidShortcutModifierError()"])
  n24{"¿existing #amp;#amp; existing.id !== id?<br/><small>L55</small>"}
  n25(["KeyboardShortcutComboAlreadyExistsError(describeCombo(combo))"])
  end
  subgraph s26["Dominio → Infraestructura"]
  n27["Puerto KeyboardShortcutRepository.findById / findByActiveCombo / update<br/>@Inject(KEYBOARD_SHORTCUT_REPOSITORY)"]
  n28["TypeOrmKeyboardShortcutRepository<br/><small>api/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts</small>"]
  n29[("findById: TypeORM Repository")]
  n30[("findByActiveCombo: TypeORM Repository")]
  n31[("update: TypeORM Repository")]
  end
  n32(["Fin: la interfaz se actualiza<br/>this.formError.set<br/>this.isSubmitting.set<br/>this.isFormOpen.set<br/>this.notificationService.success"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n1 -->|acción del usuario| n7
  n7 --> n5
  n5 --> n8
  n8 --> n11
  n11 -->|no| n12
  n12 --> n3
  n11 -->|sí| n13
  n13 -->|no| n14
  n14 --> n2
  n13 -->|sí| n15
  n15 -->|no| n16
  n16 --> n2
  n15 -->|sí| n17
  n17 --> n19
  n19 --> n20
  n20 -->|sí| n21
  n21 --> n2
  n20 -->|no| n22
  n22 -->|sí| n23
  n23 --> n2
  n22 -->|no| n24
  n24 -->|sí| n25
  n25 --> n2
  n24 -->|no| n27
  n27 -->|implementa| n28
  n28 --> n29
  n29 --> n9
  n28 --> n30
  n30 --> n9
  n28 --> n31
  n31 --> n9
  n9 --> n32
  classDef start fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20
  classDef fe fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
  classDef api fill:#ede7f6,stroke:#4527a0,color:#311b92
  classDef app fill:#e0f2f1,stroke:#00695c,color:#004d40
  classDef dom fill:#fff8e1,stroke:#f9a825,color:#5d4037
  classDef infra fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c
  classDef db fill:#eceff1,stroke:#455a64,color:#263238
  classDef dec fill:#fffde7,stroke:#f57f17,color:#3e2723
  classDef err fill:#ffebee,stroke:#c62828,color:#b71c1c
  classDef ok fill:#e8f5e9,stroke:#1b5e20,color:#1b5e20
  class n1 start
  class n2,n3,n12,n14,n16,n21,n23,n25 err
  class n5,n6,n7,n8 fe
  class n9,n32 ok
  class n11,n13,n15,n20,n22,n24 dec
  class n17 api
  class n19 app
  class n27 dom
  class n28 infra
  class n29,n30,n31 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de PATCH /api/keyboard-shortcuts/:id: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** KeyboardShortcutsPageComponent.submit (comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts`](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts), [`comercial-jhoel-app/src/app/core/services/keyboard-shortcut.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcut.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts), [`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/update-keyboard-shortcut.use-case.ts`](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/update-keyboard-shortcut.use-case.ts), [`comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/repositories/keyboard-shortcut.repository.ts`](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/domain/repositories/keyboard-shortcut.repository.ts), [`comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts`](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | rol 'ADMIN', 'SUPER_ADMIN' | DTO UpdateKeyboardShortcutRequestDto | !shortcut | !combo.altKey && !combo.ctrlKey && !combo.metaKey | existing && existing.id !== id
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
