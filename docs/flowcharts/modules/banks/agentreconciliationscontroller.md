# Mapa de AgentReconciliationsController

Módulo: **Bancos y Agentes Bancarios (día, saldos, cuadre, transferencias) (banks)** · Fuente editable: [`agentreconciliationscontroller.mmd`](agentreconciliationscontroller.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart LR
  subgraph s1["Frontend"]
  n2["CuadreAgentesService<br/><small>app/core/services/cuadre-agentes.service.ts</small>"]
  n3["CuadreAgentesPageComponent<br/><small>app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts</small>"]
  end
  subgraph s4["AgentReconciliationsController (api/banks/presentation/controllers/agent-reconciliations.controller.ts)"]
  n5["POST /api/agent-reconciliations<br/><small>create()</small>"]
  end
  subgraph s6["Aplicación"]
  n7["CloseAgentDayUseCase<br/><small>api/banks/application/use-cases/close-agent-day.use-case.ts</small>"]
  end
  subgraph s8["Dominio · Infraestructura · PostgreSQL"]
  n9["AgentReconciliationRepository"]
  n10["TypeOrmAgentReconciliationRepository<br/><small>api/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts</small>"]
  n11[["close_agent_day_with_cash_breakdown()"]]
  n12[("agent_reconciliation_cash_breakdowns")]
  n13[("agent_reconciliation_cash_details")]
  n14[["close_agent_day()"]]
  n15[("agent_reconciliations")]
  n16[("day_audit_logs")]
  n17[("day_openings")]
  n18["DayOpeningRepository"]
  n19["TypeOrmDayOpeningRepository<br/><small>api/banks/infrastructure/persistence/typeorm-day-opening.repository.ts</small>"]
  n20["GetCuadreAgentesSummaryUseCase"]
  n21["ValidateBankBalancesForDateUseCase"]
  end
  n3 -->|confirmSaveCuadre→registerReconciliation| n2
  n2 -->|registerReconciliation| n5
  n5 --> n7
  n7 -->|closeDayWithReconciliation| n9
  n9 -->|implementa| n10
  n10 -->|closeDayWithReconciliation| n11
  n11 -->|escribe| n12
  n11 -->|escribe| n13
  n10 -->|closeDayWithReconciliation| n14
  n14 -->|escribe| n15
  n14 -->|escribe| n16
  n14 -->|escribe| n17
  n7 -->|findByDate| n18
  n18 -->|implementa| n19
  n7 -->|execute| n20
  n7 -->|execute| n21
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
  class n2,n3 fe
  class n5 api
  class n7,n20,n21 app
  class n9,n18 dom
  class n10,n19 infra
  class n11,n12,n13,n14,n15,n16,n17 db
```

## Explicación

1. **¿Qué proceso representa?** Relación real entre archivos: componentes y servicios Angular que llaman a AgentReconciliationsController, sus 1 rutas, los casos de uso que ejecutan, los puertos de repositorio, sus implementaciones, las funciones SQL y las tablas.
2. **¿Dónde comienza?** Componentes Angular (izquierda) o cualquier cliente HTTP
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/banks/presentation/controllers/agent-reconciliations.controller.ts`](../../../../comercial-jhoel-api/src/modules/banks/presentation/controllers/agent-reconciliations.controller.ts), [`comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts`](../../../../comercial-jhoel-app/src/app/core/services/cuadre-agentes.service.ts), [`comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts`](../../../../comercial-jhoel-app/src/app/features/dashboard/bank-agents/cuadre-agentes-page.component.ts), [`comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.ts`](../../../../comercial-jhoel-api/src/modules/banks/application/use-cases/close-agent-day.use-case.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-agent-reconciliation.repository.ts), [`comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts`](../../../../comercial-jhoel-api/src/modules/banks/infrastructure/persistence/typeorm-day-opening.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Ver los flujos de decisiones de cada comando en business-processes/banks/
6. **¿Dónde se almacenan los datos?** agent_reconciliation_cash_breakdowns, agent_reconciliation_cash_details, agent_reconciliations, day_audit_logs, day_openings
7. **¿Cómo termina el proceso?** Las flechas terminan en las tablas de PostgreSQL
8. **¿Qué sucede cuando ocurre un error?** Los errores siguen el patrón de 07-error-handling.mmd

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
