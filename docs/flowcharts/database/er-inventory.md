# Modelo entidad-relación — Inventario

Módulo: **Inventario (inventory)** · Fuente editable: [`er-inventory.mmd`](er-inventory.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  inventory_locations {
    uuid id PK
    character_varying name
    timestamp_with_time_zone updated_at
  }
  inventory_movements {
    uuid id PK
    uuid product_id FK
    uuid presentation_id FK
    uuid location_from_id FK
    uuid location_to_id FK
    character_varying movement_type
    integer quantity_presentation
    integer quantity_base_units
    character_varying reference_type
    uuid user_id FK
  }
  product_presentations {
    uuid id PK
    uuid product_id FK
    timestamp_with_time_zone updated_at
    uuid presentation_type_id FK
  }
  products {
    uuid id PK
  }
  users {
    uuid id PK
  }
  presentation_types {
    uuid id PK
  }
  inventory_locations |o--o{ inventory_movements : "location_from_id"
  inventory_locations |o--o{ inventory_movements : "location_to_id"
  product_presentations ||--o{ inventory_movements : "presentation_id"
  products ||--o{ inventory_movements : "product_id"
  users ||--o{ inventory_movements : "user_id"
  presentation_types ||--o{ product_presentations : "presentation_type_id"
  products ||--o{ product_presentations : "product_id"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio inventory (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** inventory_locations, inventory_movements, product_presentations
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
