# Función register_warehouse_withdrawal: validaciones y escritura

Módulo: **Base de datos — escritores de saldos y transferencias** · Fuente editable: [`sql-register-warehouse-withdrawal.mmd`](sql-register-warehouse-withdrawal.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["register_warehouse_withdrawal(p_destination, p_amount, p_details, p_bank_id, p_delivered_by, p_received_by, p_voucher_reference, p_observations, p_user_id, p_idempotency_key)"])
  n2(["RAISE EXCEPTION → rollback de toda la transacción"])
  n3{"¿p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) = 0?"}
  n4["CASH_IDEMPOTENCY_KEY_REQUIRED"]
  n5{"¿p_amount IS NULL OR p_amount #lt;= 0 OR p_amount #lt;#gt; round(p_amount, 2)?"}
  n6["CASH_INVALID_AMOUNT"]
  n7{"¿p_delivered_by IS NULL OR length(btrim(p_delivered_by)) #lt; 3 OR p_received_by IS NULL OR length(btrim(p_received_by)) #lt; 3?"}
  n8["CASH_WAREHOUSE_PEOPLE_REQUIRED"]
  n9{"¿v_day.day_opening_id IS NULL OR NOT v_day.is_open?"}
  n10["CASH_CUSTODY_DAY_NOT_OPEN"]
  n11{"¿(p_destination = 'BANCO') y (p_bank_id IS NULL)?"}
  n12["WAREHOUSE_WITHDRAWAL_BANK_REQUIRED"]
  n13{"¿NOT FOUND OR NOT v_bank.is_active?"}
  n14["CASH_DEPOSIT_INVALID_BANK"]
  n15{"¿v_bank.special_account = 'GUAYACAN'?"}
  n16["CASH_DEPOSIT_GUAYACAN_NOT_ALLOWED"]
  n17{"¿p_bank_id IS NOT NULL?"}
  n18["WAREHOUSE_WITHDRAWAL_INVALID_DESTINATION"]
  n19{"¿v_total #lt;#gt; p_amount?"}
  n20["CASH_BREAKDOWN_MISMATCH"]
  n21[["apply_bank_account_movement()"]]
  n22[["apply_cash_movement()"]]
  n23[["apply_warehouse_cash_movement()"]]
  n24[["cash_custody_assert_role()"]]
  n25["Otros RAISE (condición no extraída del código):<br/>CASH_INVALID_DENOMINATION, WAREHOUSE_INSUFFICIENT_BALANCE"]
  n26[("Bajo pg_advisory_xact_lock: cash_control_main, warehouse_cash_main<br/>Escribe: warehouse_cash_movement_details, warehouse_cash_withdrawals")]
  n27(["RETURN uuid"])
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
  n11 -->|no| n13
  n13 -->|sí| n14
  n14 --> n2
  n13 -->|no| n15
  n15 -->|sí| n16
  n16 --> n2
  n15 -->|no| n17
  n17 -->|sí| n18
  n18 --> n2
  n17 -->|no| n19
  n19 -->|sí| n20
  n20 --> n2
  n19 -->|no · llama| n21
  n19 -->|no · llama| n22
  n19 -->|no · llama| n23
  n19 -->|no · llama| n24
  n1 -.->|también puede lanzar| n25
  n25 --> n2
  n19 -->|no| n26
  n26 --> n27
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
  class n2,n4,n6,n8,n10,n12,n14,n16,n18,n20,n25 err
  class n3,n5,n7,n9,n11,n13,n15,n17,n19 dec
  class n21,n22,n23,n24,n26 db
  class n27 ok
```

## Explicación

1. **¿Qué proceso representa?** Las reglas IF … RAISE EXCEPTION de register_warehouse_withdrawal en el orden del código fuente de la función, y las tablas que escribe. Es la única forma en que el sistema modifica ese saldo.
2. **¿Dónde comienza?** TypeOrmCashCustodyRepository.registerWithdrawal (comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../../comercial-jhoel-api/src/database/migrations), [`comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts`](../../../../comercial-jhoel-api/src/modules/cash-control/infrastructure/persistence/typeorm-cash-custody.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** CASH_IDEMPOTENCY_KEY_REQUIRED, CASH_INVALID_AMOUNT, CASH_WAREHOUSE_PEOPLE_REQUIRED, CASH_CUSTODY_DAY_NOT_OPEN, WAREHOUSE_WITHDRAWAL_BANK_REQUIRED, CASH_DEPOSIT_INVALID_BANK, CASH_DEPOSIT_GUAYACAN_NOT_ALLOWED, WAREHOUSE_WITHDRAWAL_INVALID_DESTINATION, CASH_BREAKDOWN_MISMATCH · además lanza (condición no extraída): CASH_INVALID_DENOMINATION, WAREHOUSE_INSUFFICIENT_BALANCE
6. **¿Dónde se almacenan los datos?** warehouse_cash_movement_details, warehouse_cash_withdrawals
7. **¿Cómo termina el proceso?** RETURN uuid dentro de la transacción de quien la llamó
8. **¿Qué sucede cuando ocurre un error?** Cada RAISE revierte también lo que hizo la función que la llamó

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
