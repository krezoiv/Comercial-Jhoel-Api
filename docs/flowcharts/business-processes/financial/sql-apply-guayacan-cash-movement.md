# Función apply_guayacan_cash_movement: validaciones y escritura

Módulo: **Base de datos — escritores de saldos y transferencias** · Fuente editable: [`sql-apply-guayacan-cash-movement.mmd`](sql-apply-guayacan-cash-movement.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["apply_guayacan_cash_movement(p_movement_type, p_amount, p_business_date, p_user_id, p_concept, p_reason, p_notes, p_reference_type, p_reference_id, p_transaction_count, p_commission_rate, p)"])
  n2(["RAISE EXCEPTION → rollback de toda la transacción"])
  n3{"¿p_concept IS NULL OR length(trim(p_concept)) = 0?"}
  n4["INVALID_CASH_MOVEMENT_CONCEPT"]
  n5{"¿p_business_date IS NULL?"}
  n6["INVALID_CASH_MOVEMENT_DATE"]
  n7{"¿v_after #lt; 0 AND p_amount #lt; 0 AND NOT COALESCE(p_allow_negative, false)?"}
  n8["CASH_BOX_INSUFFICIENT_BALANCE"]
  n9{"¿v_breakdown_total #lt;#gt; abs(p_amount)?"}
  n10["CASH_BREAKDOWN_MISMATCH"]
  n11["Otros RAISE (condición no extraída del código):<br/>INVALID_CASH_DENOMINATION, INVALID_CASH_MOVEMENT_AMOUNT"]
  n12[("Bajo pg_advisory_xact_lock: guayacan_cash_box<br/>Escribe: guayacan_cash_movement_details, guayacan_cash_movements")]
  n13(["RETURN uuid"])
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
  n1 -.->|también puede lanzar| n11
  n11 --> n2
  n9 -->|no| n12
  n12 --> n13
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
  class n2,n4,n6,n8,n10,n11 err
  class n3,n5,n7,n9 dec
  class n12 db
  class n13 ok
```

## Explicación

1. **¿Qué proceso representa?** Las reglas IF … RAISE EXCEPTION de apply_guayacan_cash_movement en el orden del código fuente de la función, y las tablas que escribe. Es la única forma en que el sistema modifica ese saldo.
2. **¿Dónde comienza?** llamada desde guayacan_commission_on_operation_insert(), guayacan_commission_on_operation_void()
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../../comercial-jhoel-api/src/database/migrations)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** INVALID_CASH_MOVEMENT_CONCEPT, INVALID_CASH_MOVEMENT_DATE, CASH_BOX_INSUFFICIENT_BALANCE, CASH_BREAKDOWN_MISMATCH · además lanza (condición no extraída): INVALID_CASH_DENOMINATION, INVALID_CASH_MOVEMENT_AMOUNT
6. **¿Dónde se almacenan los datos?** guayacan_cash_movement_details, guayacan_cash_movements
7. **¿Cómo termina el proceso?** RETURN uuid dentro de la transacción de quien la llamó
8. **¿Qué sucede cuando ocurre un error?** Cada RAISE revierte también lo que hizo la función que la llamó (guayacan_commission_on_operation_insert(), guayacan_commission_on_operation_void())

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
