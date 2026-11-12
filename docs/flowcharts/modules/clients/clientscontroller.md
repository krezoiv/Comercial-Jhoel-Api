# Mapa de ClientsController

Módulo: **Clientes (clients)** · Fuente editable: [`clientscontroller.mmd`](clientscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["ClientService<br/><small>app/core/services/client.service.ts</small>"]
  n3["ClientFormModalComponent<br/><small>app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.ts</small>"]
  n4["ClientsPageComponent<br/><small>app/features/dashboard/clients/clients-page.component.ts</small>"]
  end
  subgraph s5["ClientsController (api/clients/presentation/controllers/clients.controller.ts)"]
  n6["POST /api/clients<br/><small>create() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n7["GET /api/clients<br/><small>findAll()</small>"]
  n8["GET /api/clients/:id<br/><small>findOne()</small>"]
  n9["PATCH /api/clients/:id<br/><small>update() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  n10["DELETE /api/clients/:id<br/><small>deactivate() · 'ADMIN', 'SUPER_ADMIN'</small>"]
  end
  subgraph s11["Aplicación"]
  n12["CreateClientUseCase<br/><small>api/clients/application/use-cases/create-client.use-case.ts</small>"]
  n13["ListClientsUseCase<br/><small>api/clients/application/use-cases/list-clients.use-case.ts</small>"]
  n14["GetClientByIdUseCase<br/><small>api/clients/application/use-cases/get-client-by-id.use-case.ts</small>"]
  n15["UpdateClientUseCase<br/><small>api/clients/application/use-cases/update-client.use-case.ts</small>"]
  n16["DeactivateClientUseCase<br/><small>api/clients/application/use-cases/deactivate-client.use-case.ts</small>"]
  end
  subgraph s17["Dominio · Infraestructura · PostgreSQL"]
  n18["ClientRepository"]
  n19["TypeOrmClientRepository<br/><small>api/clients/infrastructure/persistence/typeorm-client.repository.ts</small>"]
  end
  n3 -->|submit→createClient, submit→updateClient| n2
  n4 -->|fetchClients→getClients, confirmDelete→deleteClient| n2
  n2 -->|createClient| n6
  n2 -->|getClients| n7
  n2 -->|getClientById| n8
  n2 -->|updateClient| n9
  n2 -->|deleteClient| n10
  n6 --> n12
  n7 --> n13
  n8 --> n14
  n9 --> n15
  n10 --> n16
  n12 -->|findByActiveName, create| n18
  n18 -->|implementa| n19
  n13 -->|findAll| n18
  n14 -->|findById| n18
  n15 -->|findById, findByActiveName, update| n18
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

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a ClientsController, sus 5 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts`](../../../../comercial-jhoel-api/src/modules/clients/presentation/controllers/clients.controller.ts), [`comercial-jhoel-app/src/app/core/services/client.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/client.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/components/client-form-modal/client-form-modal.component.ts), [`comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/clients/clients-page.component.ts), [`comercial-jhoel-api/src/modules/clients/application/use-cases/create-client.use-case.ts`](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/create-client.use-case.ts), [`comercial-jhoel-api/src/modules/clients/application/use-cases/list-clients.use-case.ts`](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/list-clients.use-case.ts), [`comercial-jhoel-api/src/modules/clients/application/use-cases/get-client-by-id.use-case.ts`](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/get-client-by-id.use-case.ts), [`comercial-jhoel-api/src/modules/clients/application/use-cases/update-client.use-case.ts`](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/update-client.use-case.ts), [`comercial-jhoel-api/src/modules/clients/application/use-cases/deactivate-client.use-case.ts`](../../../../comercial-jhoel-api/src/modules/clients/application/use-cases/deactivate-client.use-case.ts), [`comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts`](../../../../comercial-jhoel-api/src/modules/clients/infrastructure/persistence/typeorm-client.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/clients/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
