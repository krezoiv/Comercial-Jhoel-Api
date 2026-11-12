# Mapa de KeyboardShortcutsController

Módulo: **Atajos de teclado (keyboard-shortcuts)** · Fuente editable: [`keyboardshortcutscontroller.mmd`](keyboardshortcutscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["KeyboardShortcutService<br/><small>app/core/services/keyboard-shortcut.service.ts</small>"]
  n3["KeyboardShortcutsPageComponent<br/><small>app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts</small>"]
  n4["KeyboardShortcutsService<br/><small>app/core/services/keyboard-shortcuts.service.ts</small>"]
  end
  subgraph s5["KeyboardShortcutsController (api/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts)"]
  n6["POST /api/keyboard-shortcuts<br/><small>create() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n7["GET /api/keyboard-shortcuts<br/><small>findAll()</small>"]
  n8["GET /api/keyboard-shortcuts/:id<br/><small>findOne()</small>"]
  n9["PATCH /api/keyboard-shortcuts/:id<br/><small>update() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n10["DELETE /api/keyboard-shortcuts/:id<br/><small>deactivate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s11["Aplicación"]
  n12["CreateKeyboardShortcutUseCase<br/><small>api/keyboard-shortcuts/application/use-cases/create-keyboard-shortcut.use-case.ts</small>"]
  n13["ListKeyboardShortcutsUseCase<br/><small>api/keyboard-shortcuts/application/use-cases/list-keyboard-shortcuts.use-case.ts</small>"]
  n14["GetKeyboardShortcutByIdUseCase<br/><small>api/keyboard-shortcuts/application/use-cases/get-keyboard-shortcut-by-id.use-case.ts</small>"]
  n15["UpdateKeyboardShortcutUseCase<br/><small>api/keyboard-shortcuts/application/use-cases/update-keyboard-shortcut.use-case.ts</small>"]
  n16["DeactivateKeyboardShortcutUseCase<br/><small>api/keyboard-shortcuts/application/use-cases/deactivate-keyboard-shortcut.use-case.ts</small>"]
  end
  subgraph s17["Dominio · Infraestructura · PostgreSQL"]
  n18["KeyboardShortcutRepository"]
  n19["TypeOrmKeyboardShortcutRepository<br/><small>api/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts</small>"]
  end
  n3 -->|submit→createShortcut, fetch→getShortcuts, submit→updateShortcut …| n2
  n4 -->|refresh→getShortcuts| n2
  n2 -->|createShortcut| n6
  n2 -->|getShortcuts| n7
  n2 -->|updateShortcut| n9
  n2 -->|deactivateShortcut| n10
  n6 --> n12
  n7 --> n13
  n8 --> n14
  n9 --> n15
  n10 --> n16
  n12 -->|findByActiveCombo, create| n18
  n18 -->|implementa| n19
  n13 -->|findAll| n18
  n14 -->|findById| n18
  n15 -->|findById, findByActiveCombo, update| n18
  n16 -->|findById, deactivate| n18
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
  class n2,n3,n4 fe
  class n6,n7,n8,n9,n10 api
  class n12,n13,n14,n15,n16 app
  class n18 dom
  class n19 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a KeyboardShortcutsController, sus 5 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts`](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/presentation/controllers/keyboard-shortcuts.controller.ts), [`comercial-jhoel-app/src/app/core/services/keyboard-shortcut.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcut.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/keyboard-shortcuts/keyboard-shortcuts-page.component.ts), [`comercial-jhoel-app/src/app/core/services/keyboard-shortcuts.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/keyboard-shortcuts.service.ts), [`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/create-keyboard-shortcut.use-case.ts`](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/create-keyboard-shortcut.use-case.ts), [`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/list-keyboard-shortcuts.use-case.ts`](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/list-keyboard-shortcuts.use-case.ts), [`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/get-keyboard-shortcut-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/get-keyboard-shortcut-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/update-keyboard-shortcut.use-case.ts`](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/update-keyboard-shortcut.use-case.ts), [`comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/deactivate-keyboard-shortcut.use-case.ts`](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/application/use-cases/deactivate-keyboard-shortcut.use-case.ts), [`comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts`](../../../../comercial-jhoel-api/src/modules/keyboard-shortcuts/infrastructure/persistence/typeorm-keyboard-shortcut.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/keyboard-shortcuts/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
