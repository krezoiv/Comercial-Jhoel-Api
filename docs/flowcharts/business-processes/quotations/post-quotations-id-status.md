# POST /api/quotations/:id/status

Módulo: **Cotizaciones (quotations)** · Fuente editable: [`post-quotations-id-status.mmd`](post-quotations-id-status.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/quotations/:id/status"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["QuotationsService.changeStatus<br/><small>app/core/services/quotations.service.ts</small>"]
  n6["QuotationHistoryTabComponent.runAction<br/><small>app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["QuotationHistoryTabComponent.confirmReject<br/><small>app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts</small><br/>(se invoca desde su plantilla)"]
  n8["HTTP POST /api/quotations/:id/status<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n9["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s10["API NestJS — presentación"]
  n11{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n12(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n13{"¿QuotationStatusRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n14(["400 Datos inválidos"])
  n15["QuotationsController.changeStatus<br/><small>api/quotations/presentation/controllers/quotations.controller.ts</small>"]
  end
  subgraph s16["Aplicación — caso de uso"]
  n17["ChangeQuotationStatusUseCase.execute<br/><small>api/quotations/application/use-cases/quotation-sale.use-cases.ts</small>"]
  end
  subgraph s18["Dominio → Infraestructura"]
  n19["Puerto QuotationRepository.changeStatus<br/>@Inject(QUOTATION_REPOSITORY)"]
  n20["TypeOrmQuotationRepository<br/><small>api/quotations/infrastructure/persistence/typeorm-quotation.repository.ts</small>"]
  subgraph s21["PostgreSQL — función change_quotation_status"]
  n22[["SELECT change_quotation_status(…)<br/><small>changeStatus — una transacción</small>"]]
  n23{"¿NOT FOUND?"}
  n24(["RAISE QUOTATION_NOT_FOUND<br/>(rollback)"])
  n25{"¿p_action IN ('RECHAZAR','CANCELAR') AND (p_reason IS NULL OR length(btrim(p_reason)) #lt; 5 OR length(p_reason) #gt; 255)?"}
  n26(["RAISE QUOTATION_REASON_REQUIRED<br/>(rollback)"])
  n27{"¿v_q.status = 'VENDIDA'?"}
  n28(["RAISE QUOTATION_ALREADY_SOLD<br/>(rollback)"])
  n29["Otros RAISE de change_quotation_status (condición no extraída):<br/>QUOTATION_ALREADY_VOIDED, QUOTATION_EXPIRED, QUOTATION_INVALID_TRANSITION"]
  n30[("Escribe:<br/>quotations")]
  end
  end
  n31(["Fin: la interfaz se actualiza<br/>this.busyId.set<br/>this.notificationService.success<br/>this.notificationService.error"])
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
  n15 --> n17
  n17 --> n19
  n19 -->|implementa| n20
  n20 -->|changeStatus| n22
  n22 --> n23
  n23 -->|sí| n24
  n24 --> n2
  n23 -->|no| n25
  n25 -->|sí| n26
  n26 --> n2
  n25 -->|no| n27
  n27 -->|sí| n28
  n28 --> n2
  n22 -.->|también puede lanzar| n29
  n29 --> n2
  n27 -->|no| n30
  n30 -->|COMMIT| n9
  n9 --> n31
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
  class n2,n3,n12,n14,n24,n26,n28,n29 err
  class n5,n6,n7,n8 fe
  class n9,n31 ok
  class n11,n13,n23,n25,n27 dec
  class n15 api
  class n17 app
  class n19 dom
  class n20 infra
  class n22,n30 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/quotations/:id/status: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** QuotationHistoryTabComponent.runAction (comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts`](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts), [`comercial-jhoel-app/src/app/core/services/quotations.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/quotations.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/quotation-history-tab/quotation-history-tab.component.ts), [`comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.ts`](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/quotation-sale.use-cases.ts), [`comercial-jhoel-api/src/modules/quotations/domain/repositories/quotation.repository.ts`](../../../../comercial-jhoel-api/src/modules/quotations/domain/repositories/quotation.repository.ts), [`comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts`](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO QuotationStatusRequestDto | SQL change_quotation_status: NOT FOUND | SQL change_quotation_status: p_action IN ('RECHAZAR','CANCELAR') AND (p_reason IS NULL OR length(btrim(p_reason)) < 5 OR length(p_reason) > 255) | SQL change_quotation_status: v_q.status = 'VENDIDA'
6. **¿Dónde se almacenan los datos?** change_quotation_status(), quotations
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
