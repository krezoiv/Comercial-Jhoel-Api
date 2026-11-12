# Modelo entidad-relación — Heladería

Módulo: **Heladería (ice-creams)** · Fuente editable: [`er-ice-creams.mmd`](er-ice-creams.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  ice_cream_purchase_details {
    uuid id PK
    uuid purchase_id FK
    uuid ice_cream_id FK
    integer quantity
    numeric subtotal
  }
  ice_cream_purchases {
    uuid id PK
    uuid supplier_id FK
    uuid user_id FK
    timestamp_with_time_zone purchase_date
    numeric total
    timestamp_with_time_zone updated_at
  }
  ice_cream_sale_details {
    uuid id PK
    uuid sale_id FK
    uuid ice_cream_id FK
    integer quantity
    numeric total
  }
  ice_cream_sales {
    uuid id PK
    uuid user_id FK
    timestamp_with_time_zone sale_date
    numeric total
    timestamp_with_time_zone updated_at
  }
  ice_creams {
    uuid id PK
    timestamp_with_time_zone updated_at
    uuid created_by FK
    uuid updated_by FK
  }
  suppliers {
    uuid id PK
  }
  users {
    uuid id PK
  }
  ice_creams ||--o{ ice_cream_purchase_details : "ice_cream_id"
  ice_cream_purchases ||--o{ ice_cream_purchase_details : "purchase_id"
  suppliers ||--o{ ice_cream_purchases : "supplier_id"
  users ||--o{ ice_cream_purchases : "user_id"
  ice_creams ||--o{ ice_cream_sale_details : "ice_cream_id"
  ice_cream_sales ||--o{ ice_cream_sale_details : "sale_id"
  users ||--o{ ice_cream_sales : "user_id"
  users ||--o{ ice_creams : "created_by"
  users |o--o{ ice_creams : "updated_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio ice-creams (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** ice_cream_purchase_details, ice_cream_purchases, ice_cream_sale_details, ice_cream_sales, ice_creams
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
