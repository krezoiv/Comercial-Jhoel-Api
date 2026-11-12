# Modelo entidad-relación — Revisión de días operativos

Módulo: **Revisión de días operativos (financial-day-review)** · Fuente editable: [`er-financial-day-review.mmd`](er-financial-day-review.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  financial_day_adjustment_effects {
    uuid id PK
    uuid adjustment_id FK
    uuid bank_id FK
    uuid client_id FK
    numeric amount
  }
  financial_day_adjustments {
    uuid id PK
    uuid correction_id FK
    uuid session_id FK
    date review_date
    numeric original_amount
    numeric corrected_amount
    character_varying status
    uuid replaced_by_id FK
    uuid created_by FK
  }
  financial_day_corrections {
    uuid id PK
    uuid session_id FK
    date review_date
    character_varying correction_type
    uuid created_by FK
  }
  financial_day_review_sessions {
    uuid id PK
    date review_date
    character_varying status
    uuid opened_by FK
    uuid closed_by FK
  }
  banks {
    uuid id PK
  }
  clients {
    uuid id PK
  }
  users {
    uuid id PK
  }
  financial_day_adjustments ||--o{ financial_day_adjustment_effects : "adjustment_id"
  banks |o--o{ financial_day_adjustment_effects : "bank_id"
  clients |o--o{ financial_day_adjustment_effects : "client_id"
  financial_day_adjustments |o--o{ financial_day_adjustments : "replaced_by_id"
  financial_day_corrections ||--o| financial_day_adjustments : "correction_id"
  users ||--o{ financial_day_adjustments : "created_by"
  financial_day_review_sessions ||--o{ financial_day_adjustments : "session_id"
  users ||--o{ financial_day_corrections : "created_by"
  financial_day_review_sessions ||--o{ financial_day_corrections : "session_id"
  users |o--o{ financial_day_review_sessions : "closed_by"
  users ||--o{ financial_day_review_sessions : "opened_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio financial-day-review (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** financial_day_adjustment_effects, financial_day_adjustments, financial_day_corrections, financial_day_review_sessions
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
