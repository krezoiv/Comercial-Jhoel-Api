# Modelo entidad-relación — otros

Módulo: **otros (otros)** · Fuente editable: [`er-otros.mmd`](er-otros.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  cash_bank_day_openings {
    uuid id PK
    uuid day_opening_id FK
    date business_date
    numeric opening_cash_balance
    uuid opened_by FK
  }
  financial_day_snapshot_versions {
    uuid id PK
    uuid correction_id FK
    uuid session_id FK
    date review_date
    integer version_number
    uuid created_by FK
  }
  migrations {
    integer id PK
    character_varying name
  }
  news_notifications {
    uuid id PK
    uuid news_article_id FK
    uuid subscriber_id FK
    uuid news_type_id FK
    character_varying status
  }
  day_openings {
    uuid id PK
  }
  users {
    uuid id PK
  }
  financial_day_corrections {
    uuid id PK
  }
  financial_day_review_sessions {
    uuid id PK
  }
  news_articles {
    uuid id PK
  }
  news_types {
    uuid id PK
  }
  news_subscribers {
    uuid id PK
  }
  day_openings ||--o| cash_bank_day_openings : "day_opening_id"
  users ||--o{ cash_bank_day_openings : "opened_by"
  financial_day_corrections ||--o{ financial_day_snapshot_versions : "correction_id"
  users ||--o{ financial_day_snapshot_versions : "created_by"
  financial_day_review_sessions ||--o{ financial_day_snapshot_versions : "session_id"
  news_articles ||--o{ news_notifications : "news_article_id"
  news_types ||--o{ news_notifications : "news_type_id"
  news_subscribers ||--o{ news_notifications : "subscriber_id"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio otros (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** cash_bank_day_openings, financial_day_snapshot_versions, migrations, news_notifications
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
