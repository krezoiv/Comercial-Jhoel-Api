# Mapa de TransactionBankImagesController

Módulo: **Bancos agente (transaction-banks)** · Fuente editable: [`transactionbankimagescontroller.mmd`](transactionbankimagescontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  end
  subgraph s2["TransactionBankImagesController (api/transaction-banks/presentation/controllers/transaction-bank-images.controller.ts)"]
  n3["GET /api/public-transaction-banks/images/:id<br/><small>getImage()</small>"]
  end
  subgraph s4["Aplicación"]
  n5["GetTransactionBankImageUseCase<br/><small>api/transaction-banks/application/use-cases/get-transaction-bank-image.use-case.ts</small>"]
  end
  subgraph s6["Dominio · Infraestructura · PostgreSQL"]
  n7["TransactionBankRepository"]
  n8["TypeOrmTransactionBankRepository<br/><small>api/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts</small>"]
  end
  n3 --> n5
  n5 -->|getImage| n7
  n7 -->|implementa| n8
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
  class n3 api
  class n5 app
  class n7 dom
  class n8 infra
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a TransactionBankImagesController, sus 1 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-bank-images.controller.ts`](../../../../comercial-jhoel-api/src/modules/transaction-banks/presentation/controllers/transaction-bank-images.controller.ts), [`comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/get-transaction-bank-image.use-case.ts`](../../../../comercial-jhoel-api/src/modules/transaction-banks/application/use-cases/get-transaction-bank-image.use-case.ts), [`comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts`](../../../../comercial-jhoel-api/src/modules/transaction-banks/infrastructure/persistence/typeorm-transaction-bank.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/transaction-banks/
6. **¿Dónde se almacenan los datos?** sin tablas detectadas
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
