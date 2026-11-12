# Modelo entidad-relación — Atajos de teclado

Módulo: **Atajos de teclado (keyboard-shortcuts)** · Fuente editable: [`er-keyboard-shortcuts.mmd`](er-keyboard-shortcuts.mmd) · [Índice de diagramas](../README.md)

```mermaid
erDiagram
  keyboard_shortcuts {
    uuid id PK
    timestamp_with_time_zone updated_at
    uuid created_by FK
    uuid updated_by FK
  }
  users {
    uuid id PK
  }
  users ||--o{ keyboard_shortcuts : "created_by"
  users |o--o{ keyboard_shortcuts : "updated_by"
```

## Explicación

1. **¿Qué proceso representa?** Tablas del dominio keyboard-shortcuts (asignadas al módulo que más las usa), columnas importantes (PK, FK, montos, estados, fechas), llaves foráneas reales y su cardinalidad (|o = FK opcional, o| = relación 1 a 1 por UNIQUE)
2. **¿Dónde comienza?** Esquema real de PostgreSQL (pg_catalog)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/database/migrations`](../../../comercial-jhoel-api/src/database/migrations), [`docs/codebase-study/05_DATABASE_REFERENCE.md`](../../../docs/codebase-study/05_DATABASE_REFERENCE.md)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica (estructura)
6. **¿Dónde se almacenan los datos?** keyboard_shortcuts
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** Las restricciones CHECK/UNIQUE/FK rechazan filas inválidas (ver la referencia de la tabla)

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
