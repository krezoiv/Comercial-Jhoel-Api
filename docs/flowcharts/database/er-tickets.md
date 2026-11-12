# Modelo entidad-relación — Tickets

Módulo: **Tickets (tickets)** · Fuente editable: [`er-tickets.mmd`](er-tickets.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  ticket_details {
    uuid id PK
    uuid ticket_id FK
    uuid product_id FK
    character_varying product_name
    character_varying presentation_name
    integer quantity
    numeric total
  }
  tickets {
    uuid id PK
    character_varying ticket_number
    uuid client_id FK
    uuid user_id FK
    numeric subtotal
    numeric total
    uuid voided_by FK
    timestamp_with_time_zone updated_at
    character_varying client_name
  }
  products {
    uuid id PK
  }
  clients {
    uuid id PK
  }
  users {
    uuid id PK
  }
  products ||--o{ ticket_details : "product_id"
  tickets ||--o{ ticket_details : "ticket_id"
  clients |o--o{ tickets : "client_id"
  users ||--o{ tickets : "user_id"
  users |o--o{ tickets : "voided_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio tickets (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** ticket_details, tickets
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
