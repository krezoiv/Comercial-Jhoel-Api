# Mapa de NewsController

Módulo: **Noticias (news)** · Fuente editable: [`newscontroller.mmd`](newscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["NewsService<br/><small>app/core/services/news.service.ts</small>"]
  n3["NewsFormModalComponent<br/><small>app/features/dashboard/news/components/news-form-modal/news-form-modal.component.ts</small>"]
  n4["NewsPageComponent<br/><small>app/features/dashboard/news/news-page.component.ts</small>"]
  n5["NewsImageModalComponent<br/><small>app/features/dashboard/news/components/news-image-modal/news-image-modal.component.ts</small>"]
  end
  subgraph s6["NewsController (api/news/presentation/controllers/news.controller.ts)"]
  n7["POST /api/news<br/><small>create() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n8["GET /api/news<br/><small>findAll() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n9["GET /api/news/:id<br/><small>findOne() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n10["PATCH /api/news/:id<br/><small>update() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n11["POST /api/news/:id/activate<br/><small>activate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n12["DELETE /api/news/:id<br/><small>deactivate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n13["POST /api/news/reorder<br/><small>reorder() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n14["POST /api/news/:id/image<br/><small>setImage() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n15["DELETE /api/news/:id/image<br/><small>removeImage() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s16["Aplicación"]
  n17["CreateNewsArticleUseCase<br/><small>api/news/application/use-cases/create-news-article.use-case.ts</small>"]
  n18["ListNewsArticlesUseCase<br/><small>api/news/application/use-cases/list-news-articles.use-case.ts</small>"]
  n19["GetNewsArticleByIdUseCase<br/><small>api/news/application/use-cases/get-news-article-by-id.use-case.ts</small>"]
  n20["UpdateNewsArticleUseCase<br/><small>api/news/application/use-cases/update-news-article.use-case.ts</small>"]
  n21["SetNewsArticleActiveUseCase<br/><small>api/news/application/use-cases/set-news-article-active.use-case.ts</small>"]
  n22["ReorderNewsArticlesUseCase<br/><small>api/news/application/use-cases/reorder-news-articles.use-case.ts</small>"]
  n23["SetNewsArticleImageUseCase<br/><small>api/news/application/use-cases/set-news-article-image.use-case.ts</small>"]
  n24["RemoveNewsArticleImageUseCase<br/><small>api/news/application/use-cases/remove-news-article-image.use-case.ts</small>"]
  end
  subgraph s25["Dominio · Infraestructura · PostgreSQL"]
  n26["NewsArticleRepository"]
  n27["TypeOrmNewsArticleRepository<br/><small>api/news/infrastructure/persistence/typeorm-news-article.repository.ts</small>"]
  n28["NewsTypeRepository"]
  n29["TypeOrmNewsTypeRepository<br/><small>api/news-types/infrastructure/persistence/typeorm-news-type.repository.ts</small>"]
  n30["SendPushForArticleUseCase"]
  end
  n3 -->|submit→createArticle, submit→updateArticle| n2
  n4 -->|fetchArticles→getArticles, toggleActive→activateArticle, toggleActive→deactivateArticle …| n2
  n5 -->|refetch→getArticleById, onFileSelected→setImage, removeImage→removeImage| n2
  n2 -->|createArticle| n7
  n2 -->|getArticles| n8
  n2 -->|getArticleById| n9
  n2 -->|updateArticle| n10
  n2 -->|activateArticle| n11
  n2 -->|deactivateArticle| n12
  n2 -->|reorderArticles| n13
  n2 -->|setImage| n14
  n2 -->|removeImage| n15
  n7 --> n17
  n8 --> n18
  n9 --> n19
  n10 --> n20
  n11 --> n21
  n12 --> n21
  n13 --> n22
  n14 --> n23
  n15 --> n24
  n17 -->|findBySlug, create| n26
  n26 -->|implementa| n27
  n17 -->|findById| n28
  n28 -->|implementa| n29
  n17 -->|execute| n30
  n18 -->|findAll| n26
  n19 -->|findById| n26
  n20 -->|findById, update| n26
  n20 -->|findById| n28
  n21 -->|findById, setActive| n26
  n22 -->|findById, reorder| n26
  n23 -->|findById, setImage| n26
  n24 -->|findById, removeImage| n26
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
  class n7,n8,n9,n10,n11,n12,n13,n14,n15 api
  class n17,n18,n19,n20,n21,n22,n23,n24,n30 app
  class n26,n28 dom
  class n27,n29 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a NewsController, sus 9 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts`](../../../../comercial-jhoel-api/src/modules/news/presentation/controllers/news.controller.ts), [`comercial-jhoel-app/src/app/core/services/news.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/news.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-form-modal/news-form-modal.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/news/news-page.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/news/components/news-image-modal/news-image-modal.component.ts), [`comercial-jhoel-api/src/modules/news/application/use-cases/create-news-article.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/create-news-article.use-case.ts), [`comercial-jhoel-api/src/modules/news/application/use-cases/list-news-articles.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/list-news-articles.use-case.ts), [`comercial-jhoel-api/src/modules/news/application/use-cases/get-news-article-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/get-news-article-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/news/application/use-cases/update-news-article.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/update-news-article.use-case.ts), [`comercial-jhoel-api/src/modules/news/application/use-cases/set-news-article-active.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/set-news-article-active.use-case.ts), [`comercial-jhoel-api/src/modules/news/application/use-cases/reorder-news-articles.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/reorder-news-articles.use-case.ts), [`comercial-jhoel-api/src/modules/news/application/use-cases/set-news-article-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/set-news-article-image.use-case.ts), [`comercial-jhoel-api/src/modules/news/application/use-cases/remove-news-article-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/news/application/use-cases/remove-news-article-image.use-case.ts), [`comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts`](../../../../comercial-jhoel-api/src/modules/news/infrastructure/persistence/typeorm-news-article.repository.ts), [`comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts`](../../../../comercial-jhoel-api/src/modules/news-types/infrastructure/persistence/typeorm-news-type.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/news/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
