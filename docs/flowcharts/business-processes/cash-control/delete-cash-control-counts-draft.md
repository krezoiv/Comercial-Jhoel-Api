# DELETE /api/cash-control/counts/draft

Módulo: **Control de Efectivo (Kardex, cortes, arqueos, Bodega) (cash-control)** · Fuente editable: [`delete-cash-control-counts-draft.mmd`](delete-cash-control-counts-draft.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta DELETE /api/cash-control/counts/draft"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["CashCustodyService.discardCountDraft<br/><small>app/core/services/cash-custody.service.ts</small>"]
  n6["CashCountModalComponent.resetDraft<br/><small>app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP DELETE /api/cash-control/counts/draft<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12["CashCustodyController.discardCountDraft<br/><small>api/cash-control/presentation/controllers/cash-custody.controller.ts</small>"]
  end
  subgraph s13["Aplicación — caso de uso"]
  n14["DiscardCashCountDraftUseCase.execute<br/><small>api/cash-control/application/use-cases/cash-custody.use-cases.ts</small>"]
  n15["assertCashCustodyPermission()<br/><small>llamada en L718</small><br/><small>api/cash-control/domain/policies/cash-control.policy.ts</small>"]
  n16{"¿!(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', )?<br/><small>L32</small>"}
  n17(["cashControlError('CASH_CUSTODY_FORBIDDEN')"])
  end
  subgraph s18["Dominio → Infraestructura"]
  n19["Puerto CashCustodyRepository.deleteCountDraft<br/>@Inject(CASH_CUSTODY_REPOSITORY)"]
  n20["TypeOrmCashCustodyRepository<br/><small>api/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts</small>"]
  n21[("deleteCountDraft: SQL / TypeORM sobre<br/>cash_count_drafts")]
  end
  n22(["Fin: la interfaz se actualiza<br/>this.draftRestored.set<br/>this.draftStatus.set<br/>this.draftSavedAt.set<br/>this.draftError.set"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n5 --> n7
  n7 --> n10
  n10 -->|no| n11
  n11 --> n3
  n10 -->|sí| n12
  n12 --> n14
  n14 --> n15
  n15 --> n16
  n16 -->|sí| n17
  n17 --> n2
  n16 -->|no| n19
  n19 -->|implementa| n20
  n20 --> n21
  n21 --> n8
  n8 --> n22
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
  class n2,n3,n11,n17 err
  class n5,n6,n7 fe
  class n8,n22 ok
  class n10,n16 dec
  class n12 api
  class n14 app
  class n15,n19 dom
  class n20 infra
  class n21 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de DELETE /api/cash-control/counts/draft: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CashCountModalComponent.resetDraft (comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/presentation/controllers/cash-custody.controller.ts), [`comercial-jhoel-app/src/app/core/services/cash-custody.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cash-custody.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/cash-control/components/cash-count-modal/cash-count-modal.component.ts), [`comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/application/use-cases/cash-custody.use-cases.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/policies/cash-control.policy.ts), [`comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/domain/repositories/cash-custody.repository.ts), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | !(CASH_CUSTODY_PERMISSION_ROLES[permission] as readonly string[]).includes( role ?? '', )
6. **¿Dónde se almacenan los datos?** cash_count_drafts
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
