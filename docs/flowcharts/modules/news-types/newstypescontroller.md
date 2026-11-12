# Mapa de NewsTypesController

Módulo: **Tipos de noticia (news-types)** · Fuente editable: [`newstypescontroller.mmd`](newstypescontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["NewsTypeService<br/><small>app/core/services/news-type.service.ts</small>"]
  n3["NewsTypeFormModalComponent<br/><small>app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.ts</small>"]
  n4["NewsTypesPageComponent<br/><small>app/features/dashboard/news-types/news-types-page.component.ts</small>"]
  end
  subgraph s5["NewsTypesController (api/news-types/presentation/controllers/news-types.controller.ts)"]
  n6["POST /api/news-types<br/><small>create() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n7["GET /api/news-types<br/><small>findAll()</small>"]
  n8["GET /api/news-types/:id<br/><small>findOne()</small>"]
  n9["PATCH /api/news-types/:id<br/><small>update() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n10["DELETE /api/news-types/:id<br/><small>deactivate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n11["POST /api/news-types/reorder<br/><small>reorder() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s12["Aplicación"]
  n13["CreateNewsTypeUseCase<br/><small>api/news-types/application/use-cases/create-news-type.use-case.ts</small>"]
  n14["ListNewsTypesUseCase<br/><small>api/news-types/application/use-cases/list-news-types.use-case.ts</small>"]
  n15["GetNewsTypeByIdUseCase<br/><small>api/news-types/application/use-cases/get-news-type-by-id.use-case.ts</small>"]
  n16["UpdateNewsTypeUseCase<br/><small>api/news-types/application/use-cases/update-news-type.use-case.ts</small>"]
  n17["DeactivateNewsTypeUseCase<br/><small>api/news-types/application/use-cases/deactivate-news-type.use-case.ts</small>"]
  n18["ReorderNewsTypesUseCase<br/><small>api/news-types/application/use-cases/reorder-news-types.use-case.ts</small>"]
  end
  subgraph s19["Dominio · Infraestructura · PostgreSQL"]
  n20["NewsTypeRepository"]
  n21["TypeOrmNewsTypeRepository<br/><small>api/news-types/infrastructure/persistence/typeorm-news-type.repository.ts</small>"]
  end
  n3 -->|submit→createType, submit→updateType| n2
  n4 -->|fetchTypes→getTypes, toggleActive→updateType, toggleActive→deactivateType …| n2
  n2 -->|createType| n6
  n2 -->|getTypes| n7
  n2 -->|getTypeById| n8
  n2 -->|updateType| n9
  n2 -->|deactivateType| n10
  n2 -->|reorderTypes| n11
  n6 --> n13
  n7 --> n14
  n8 --> n15
  n9 --> n16
  n10 --> n17
  n11 --> n18
  n13 -->|findByName, create, findBySlug| n20
  n20 -->|implementa| n21
  n14 -->|findAll| n20
  n15 -->|findById| n20
  n16 -->|findById, findByName, update| n20
  n17 -->|findById, deactivate| n20
  n18 -->|findById, reorder| n20
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
  class n6,n7,n8,n9,n10,n11 api
  class n13,n14,n15,n16,n17,n18 app
  class n20 dom
  class n21 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a NewsTypesController, sus 6 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts`](../../../../comercial-jhoel-api/src/modules/news-types/presentation/controllers/news-types.controller.ts), [`comercial-jhoel-app/src/app/core/services/news-type.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/news-type.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/components/news-type-form-modal/news-type-form-modal.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/news-types/news-types-page.component.ts), [`comercial-jhoel-api/src/modules/news-types/application/use-cases/create-news-type.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/create-news-type.use-case.ts), [`comercial-jhoel-api/src/modules/news-types/application/use-cases/list-news-types.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/list-news-types.use-case.ts), [`comercial-jhoel-api/src/modules/news-types/application/use-cases/get-news-type-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/get-news-type-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/news-types/application/use-cases/update-news-type.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/update-news-type.use-case.ts), [`comercial-jhoel-api/src/modules/news-types/application/use-cases/deactivate-news-type.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/deactivate-news-type.use-case.ts), [`comercial-jhoel-api/src/modules/news-types/application/use-cases/reorder-news-types.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news-types/application/use-cases/reorder-news-types.use-case.ts), [`comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/news-types/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
