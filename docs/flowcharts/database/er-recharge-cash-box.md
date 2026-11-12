# Modelo entidad-relación — Caja de recargas

Módulo: **Caja de recargas (recharge-cash-box)** · Fuente editable: [`er-recharge-cash-box.mmd`](er-recharge-cash-box.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  recharge_cash_box_movements {
    uuid id PK
    numeric amount
    date business_date
    uuid created_by FK
    uuid voided_by FK
    character_varying movement_type
  }
  recharge_sim_purchases {
    uuid id PK
    uuid sim_type_id FK
    uuid daily_stock_id FK
    integer quantity
    numeric total_cost
    date purchase_date
    uuid created_by FK
  }
  users {
    uuid id PK
  }
  recharge_sim_daily_stock {
    uuid id PK
  }
  recharge_sim_types {
    uuid id PK
  }
  users ||--o{ recharge_cash_box_movements : "created_by"
  users |o--o{ recharge_cash_box_movements : "voided_by"
  users ||--o{ recharge_sim_purchases : "created_by"
  recharge_sim_daily_stock ||--o{ recharge_sim_purchases : "daily_stock_id"
  recharge_sim_types ||--o{ recharge_sim_purchases : "sim_type_id"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio recharge-cash-box (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** recharge_cash_box_movements, recharge_sim_purchases
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
