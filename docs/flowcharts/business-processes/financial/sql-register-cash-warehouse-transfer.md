# Función register_cash_warehouse_transfer: validaciones y escritura

Módulo: **Base de datos — escritores de saldos y transferencias** · Fuente editable: [`sql-register-cash-warehouse-transfer.mmd`](sql-register-cash-warehouse-transfer.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["register_cash_warehouse_transfer(p_amount, p_details, p_delivered_by, p_received_by, p_voucher_reference, p_observations, p_user_id, p_idempotency_key)"])
  n2(["RAISE EXCEPTION → rollback de toda la transacción"])
  n3{"¿p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0?"}
  n4["CASH_IDEMPOTENCY_KEY_REQUIRED"]
  n5{"¿p_delivered_by IS NULL OR length(btrim(p_delivered_by)) #lt; 3 OR p_received_by IS NULL OR length(btrim(p_received_by)) #lt; 3?"}
  n6["CASH_WAREHOUSE_PEOPLE_REQUIRED"]
  n7{"¿v_day.day_opening_id IS NULL OR NOT v_day.is_open?"}
  n8["CASH_CUSTODY_DAY_NOT_OPEN"]
  n9{"¿v_total #lt;#gt; p_amount?"}
  n10["CASH_BREAKDOWN_MISMATCH"]
  n11{"¿cash_balance() #lt; p_amount?"}
  n12["CASH_INSUFFICIENT_BALANCE"]
  n13[["apply_cash_movement()"]]
  n14[["apply_warehouse_cash_movement()"]]
  n15[["cash_custody_assert_role()"]]
  n16["Otros RAISE (condición no extraída del código):<br/>CASH_INVALID_AMOUNT, CASH_INVALID_DENOMINATION"]
  n17[("Bajo pg_advisory_xact_lock: cash_control_main, warehouse_cash_main<br/>Escribe: cash_movement_details, cash_warehouse_transfers")]
  n18(["RETURN uuid"])
  n1 --> n3
  n3 -->|sí| n4
  n4 --> n2
  n3 -->|no| n5
  n5 -->|sí| n6
  n6 --> n2
  n5 -->|no| n7
  n7 -->|sí| n8
  n8 --> n2
  n7 -->|no| n9
  n9 -->|sí| n10
  n10 --> n2
  n9 -->|no| n11
  n11 -->|sí| n12
  n12 --> n2
  n11 -->|no · llama| n13
  n11 -->|no · llama| n14
  n11 -->|no · llama| n15
  n1 -.->|también puede lanzar| n16
  n16 --> n2
  n11 -->|no| n17
  n17 --> n18
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
  class n2,n4,n6,n8,n10,n12,n16 err
  class n3,n5,n7,n9,n11 dec
  class n13,n14,n15,n17 db
  class n18 ok
```

## Explicación

1. **¿Qué proceso representa?** Las reglas IF … RAISE EXCEPTION de register_cash_warehouse_transfer en el orden del código fuente de la función, y las tablas que escribe. Es la única forma en que el sistema modifica ese saldo.
2. **¿Dónde comienza?** TypeOrmCashCustodyRepository.registerTransfer (comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../../comercial-jhoel-api/src/database/migrations), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** CASH_IDEMPOTENCY_KEY_REQUIRED, CASH_WAREHOUSE_PEOPLE_REQUIRED, CASH_CUSTODY_DAY_NOT_OPEN, CASH_BREAKDOWN_MISMATCH, CASH_INSUFFICIENT_BALANCE · además lanza (condición no extraída): CASH_INVALID_AMOUNT, CASH_INVALID_DENOMINATION
6. **¿Dónde se almacenan los datos?** cash_movement_details, cash_warehouse_transfers
7. **¿Cómo termina el proceso?** RETURN uuid dentro de la transacción de quien la llamó
8. **¿Qué sucede cuando ocurre un error?** Cada RAISE revierte también lo que hizo la función que la llamó

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
