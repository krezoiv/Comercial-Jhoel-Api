# Mapa de LandingBackgroundsController

Módulo: **Fondos de la landing (landing-backgrounds)** · Fuente editable: [`landingbackgroundscontroller.mmd`](landingbackgroundscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["LandingBackgroundService<br/><small>app/core/services/landing-background.service.ts</small>"]
  n3["BackgroundFormModalComponent<br/><small>app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.ts</small>"]
  n4["LandingBackgroundsPageComponent<br/><small>app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts</small>"]
  n5["BackgroundImageModalComponent<br/><small>app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.ts</small>"]
  end
  subgraph s6["LandingBackgroundsController (api/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts)"]
  n7["POST /api/landing-backgrounds<br/><small>create() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n8["GET /api/landing-backgrounds<br/><small>findAll() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n9["GET /api/landing-backgrounds/:id<br/><small>findOne() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n10["PATCH /api/landing-backgrounds/:id<br/><small>update() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n11["POST /api/landing-backgrounds/:id/activate<br/><small>activate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n12["DELETE /api/landing-backgrounds/:id<br/><small>deactivate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n13["POST /api/landing-backgrounds/:id/image<br/><small>setImage() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n14["DELETE /api/landing-backgrounds/:id/image<br/><small>removeImage() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s15["Aplicación"]
  n16["CreateLandingBackgroundUseCase<br/><small>api/landing-backgrounds/application/use-cases/create-landing-background.use-case.ts</small>"]
  n17["ListLandingBackgroundsUseCase<br/><small>api/landing-backgrounds/application/use-cases/list-landing-backgrounds.use-case.ts</small>"]
  n18["GetLandingBackgroundByIdUseCase<br/><small>api/landing-backgrounds/application/use-cases/get-landing-background-by-id.use-case.ts</small>"]
  n19["UpdateLandingBackgroundUseCase<br/><small>api/landing-backgrounds/application/use-cases/update-landing-background.use-case.ts</small>"]
  n20["SetLandingBackgroundActiveUseCase<br/><small>api/landing-backgrounds/application/use-cases/set-landing-background-active.use-case.ts</small>"]
  n21["SetLandingBackgroundImageUseCase<br/><small>api/landing-backgrounds/application/use-cases/set-landing-background-image.use-case.ts</small>"]
  n22["RemoveLandingBackgroundImageUseCase<br/><small>api/landing-backgrounds/application/use-cases/remove-landing-background-image.use-case.ts</small>"]
  end
  subgraph s23["Dominio · Infraestructura · PostgreSQL"]
  n24["LandingBackgroundRepository"]
  n25["TypeOrmLandingBackgroundRepository<br/><small>api/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts</small>"]
  end
  n3 -->|submit→createBackground, submit→updateBackground| n2
  n4 -->|fetchBackgrounds→getBackgrounds, toggleActive→activateBackground, toggleActive→deactivateBackground| n2
  n5 -->|refetch→getBackgroundById, onFileSelected→setImage, removeImage→removeImage| n2
  n2 -->|createBackground| n7
  n2 -->|getBackgrounds| n8
  n2 -->|getBackgroundById| n9
  n2 -->|updateBackground| n10
  n2 -->|activateBackground| n11
  n2 -->|deactivateBackground| n12
  n2 -->|setImage| n13
  n2 -->|removeImage| n14
  n7 --> n16
  n8 --> n17
  n9 --> n18
  n10 --> n19
  n11 --> n20
  n12 --> n20
  n13 --> n21
  n14 --> n22
  n16 -->|findActiveBySectionKey, create| n24
  n24 -->|implementa| n25
  n17 -->|findAll| n24
  n18 -->|findById| n24
  n19 -->|findById, findActiveBySectionKey, update| n24
  n20 -->|findById, findActiveBySectionKey, setActive| n24
  n21 -->|findById, setImage| n24
  n22 -->|findById, removeImage| n24
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
  class n2,n3,n4,n5 fe
  class n7,n8,n9,n10,n11,n12,n13,n14 api
  class n16,n17,n18,n19,n20,n21,n22 app
  class n24 dom
  class n25 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a LandingBackgroundsController, sus 8 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/presentation/controllers/landing-backgrounds.controller.ts), [`comercial-jhoel-app/src/app/core/services/landing-background.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/landing-background.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-form-modal/background-form-modal.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/landing-backgrounds-page.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/landing-backgrounds/components/background-image-modal/background-image-modal.component.ts), [`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/create-landing-background.use-case.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/create-landing-background.use-case.ts), [`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/list-landing-backgrounds.use-case.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/list-landing-backgrounds.use-case.ts), [`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/get-landing-background-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/get-landing-background-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/update-landing-background.use-case.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/update-landing-background.use-case.ts), [`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/set-landing-background-active.use-case.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/set-landing-background-active.use-case.ts), [`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/set-landing-background-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/set-landing-background-image.use-case.ts), [`comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/remove-landing-background-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/application/use-cases/remove-landing-background-image.use-case.ts), [`comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts`](../../../../comercial-jhoel-api/src/modules/landing-backgrounds/infrastructure/persistence/typeorm-landing-background.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/landing-backgrounds/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
