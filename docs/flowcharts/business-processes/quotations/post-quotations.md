# POST /api/quotations

Módulo: **Cotizaciones (quotations)** · Fuente editable: [`post-quotations.mmd`](post-quotations.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/quotations"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["QuotationsService.createQuotation<br/><small>app/core/services/quotations.service.ts</small>"]
  n6["CreateQuotationTabComponent.saveQuotation<br/><small>app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts</small><br/>(se invoca desde su plantilla)"]
  n7["HTTP POST /api/quotations<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n8["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s9["API NestJS — presentación"]
  n10{"¿Token válido y usuario activo?<br/>(JwtAuthGuard → JwtStrategy.validate)"}
  n11(["401 No autorizado<br/>(authInterceptor cierra sesión)"])
  n12{"¿CreateQuotationRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n13(["400 Datos inválidos"])
  n14["QuotationsController.create<br/><small>api/quotations/presentation/controllers/quotations.controller.ts</small>"]
  end
  subgraph s15["Aplicación — caso de uso"]
  n16["CreateQuotationUseCase.execute<br/><small>api/quotations/application/use-cases/create-quotation.use-case.ts</small>"]
  n17{"¿!input.items #124;#124; input.items.length === 0?<br/><small>L47</small>"}
  n18(["QuotationEmptyError()"])
  n19{"¿!client #124;#124; !client.isActive?<br/><small>L52</small>"}
  n20(["InvalidClientError()"])
  n21{"¿input.expirationDate #lt; todayIsoDate()?<br/><small>L56</small>"}
  n22(["InvalidExpirationDateError()"])
  n23{"¿!Number.isInteger(item.quantity) #124;#124; item.quantity #lt;= 0?<br/><small>L61</small>"}
  n24(["InvalidQuotationQuantityError(item.productId)"])
  n25{"¿item.discount != null #amp;#amp; item.discount #lt; 0?<br/><small>L64</small>"}
  n26(["InvalidQuotationDiscountError(item.productId)"])
  end
  n27["Puerto ClientRepository<br/><small>findById</small>"]
  subgraph s28["Dominio → Infraestructura"]
  n29["Puerto QuotationRepository.createQuotation<br/>@Inject(QUOTATION_REPOSITORY)"]
  n30["TypeOrmQuotationRepository<br/><small>api/quotations/infrastructure/persistence/typeorm-quotation.repository.ts</small>"]
  subgraph s31["PostgreSQL — función create_quotation"]
  n32[["SELECT create_quotation(…)<br/><small>createQuotation — una transacción</small>"]]
  n33{"¿p_items IS NULL OR jsonb_array_length(p_items) = 0?"}
  n34(["RAISE QUOTATION_EMPTY<br/>(rollback)"])
  n35{"¿NOT FOUND?"}
  n36(["RAISE CLIENT_NOT_FOUND<br/>(rollback)"])
  n37{"¿p_expiration_date #lt; CURRENT_DATE?"}
  n38(["RAISE INVALID_EXPIRATION_DATE<br/>(rollback)"])
  n39{"¿v_quantity IS NULL OR v_quantity #lt;= 0?"}
  n40(["RAISE INVALID_QUANTITY<br/>(rollback)"])
  n41{"¿v_discount #lt; 0?"}
  n42(["RAISE INVALID_DISCOUNT<br/>(rollback)"])
  n43{"¿NOT FOUND?"}
  n44(["RAISE PRODUCT_NOT_FOUND<br/>(rollback)"])
  n45{"¿NOT v_product.is_active?"}
  n46(["RAISE PRODUCT_INACTIVE<br/>(rollback)"])
  n47[("Escribe:<br/>quotation_details<br/>quotations")]
  end
  end
  n48(["Fin: la interfaz se actualiza<br/>this.clientError.set<br/>this.notificationService.error<br/>this.dateError.set<br/>this.isSaving.set<br/>this.notificationService.success"])
  n2 --> n3
  n1 -->|acción del usuario| n6
  n6 --> n5
  n5 --> n7
  n7 --> n10
  n10 -->|no| n11
  n11 --> n3
  n10 -->|sí| n12
  n12 -->|no| n13
  n13 --> n2
  n12 -->|sí| n14
  n14 --> n16
  n16 --> n17
  n17 -->|sí| n18
  n18 --> n2
  n17 -->|no| n19
  n19 -->|sí| n20
  n20 --> n2
  n19 -->|no| n21
  n21 -->|sí| n22
  n22 --> n2
  n21 -->|no| n23
  n23 -->|sí| n24
  n24 --> n2
  n23 -->|no| n25
  n25 -->|sí| n26
  n26 --> n2
  n16 -.->|consulta| n27
  n25 -->|no| n29
  n29 -->|implementa| n30
  n30 -->|createQuotation| n32
  n32 --> n33
  n33 -->|sí| n34
  n34 --> n2
  n33 -->|no| n35
  n35 -->|sí| n36
  n36 --> n2
  n35 -->|no| n37
  n37 -->|sí| n38
  n38 --> n2
  n37 -->|no| n39
  n39 -->|sí| n40
  n40 --> n2
  n39 -->|no| n41
  n41 -->|sí| n42
  n42 --> n2
  n41 -->|no| n43
  n43 -->|sí| n44
  n44 --> n2
  n43 -->|no| n45
  n45 -->|sí| n46
  n46 --> n2
  n45 -->|no| n47
  n47 -->|COMMIT| n8
  n8 --> n48
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
  class n2,n3,n11,n13,n18,n20,n22,n24,n26,n34,n36,n38,n40,n42,n44,n46 err
  class n5,n6,n7 fe
  class n8,n48 ok
  class n10,n12,n17,n19,n21,n23,n25,n33,n35,n37,n39,n41,n43,n45 dec
  class n14 api
  class n16 app
  class n27,n29 dom
  class n30 infra
  class n32,n47 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/quotations: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** CreateQuotationTabComponent.saveQuotation (comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts`](../../../../comercial-jhoel-api/src/modules/quotations/presentation/controllers/quotations.controller.ts), [`comercial-jhoel-app/src/app/core/services/quotations.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/quotations.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/quotations/components/create-quotation-tab/create-quotation-tab.component.ts), [`comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.ts`](../../../../comercial-jhoel-api/src/modules/quotations/application/use-cases/create-quotation.use-case.ts), [`comercial-jhoel-api/src/modules/clients/domain/repositories/client.repository.ts`](../../../../comercial-jhoel-api/src/modules/clients/domain/repositories/client.repository.ts), [`comercial-jhoel-api/src/modules/quotations/domain/repositories/quotation.repository.ts`](../../../../comercial-jhoel-api/src/modules/quotations/domain/repositories/quotation.repository.ts), [`comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts`](../../../../comercial-jhoel-api/src/modules/quotations/infrastructure/persistence/typeorm-quotation.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** sesión JWT válida | DTO CreateQuotationRequestDto | !input.items || input.items.length === 0 | !client || !client.isActive | input.expirationDate < todayIsoDate() | !Number.isInteger(item.quantity) || item.quantity <= 0 | item.discount != null && item.discount < 0 | SQL create_quotation: p_items IS NULL OR jsonb_array_length(p_items) = 0 | SQL create_quotation: NOT FOUND | SQL create_quotation: p_expiration_date < CURRENT_DATE | SQL create_quotation: v_quantity IS NULL OR v_quantity <= 0 | SQL create_quotation: v_discount < 0 | SQL create_quotation: NOT FOUND | SQL create_quotation: NOT v_product.is_active
6. **¿Dónde se almacenan los datos?** create_quotation(), quotation_details, quotations
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
