# Qué módulos usan las tablas — Cuentas por Cobrar

Módulo: **Cuentas por Cobrar (accounts-receivable)** · Fuente editable: [`table-usage-accounts-receivable.mmd`](table-usage-accounts-receivable.mmd) · [Índice de diagramas](../README.md)

```mermaid
flowchart LR
  n1[("account_receivable_payment_details")]
  n2["Cuentas por Cobrar<br/><small>api/accounts-receivable</small>"]
  n3[("account_receivable_payment_operations")]
  n4[("accounts_receivable")]
  n5["Revisión de días operativos<br/><small>api/financial-day-review</small>"]
  n6[("cash_movements")]
  n7["Control de Efectivo (Kardex, cortes, arqueos, Bodega)<br/><small>api/cash-control</small>"]
  n2 -->|consulta · escribe vía settle_accounts_receivable()| n1
  n2 -->|consulta · escribe vía settle_accounts_receivable() …| n3
  n2 -->|consulta · entidad ORM …| n4
  n5 -->|consulta| n4
  n2 -->|consulta| n6
  n7 -->|consulta| n6
  n5 -->|consulta| n6
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
  class n1,n3,n4,n6 db
  class n2,n5,n7 app
```

## Explicación

1. **¿Qué proceso representa?** Módulos del backend que usan cada tabla y cómo: entidad TypeORM, consulta SQL, escritura SQL directa o escritura a través de una función PL/pgSQL
2. **¿Dónde comienza?** Código de comercial-jhoel-api/src/modules (sin migraciones ni pruebas)
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules`](../../../comercial-jhoel-api/src/modules)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** No aplica
6. **¿Dónde se almacenan los datos?** account_receivable_payment_details, account_receivable_payment_operations, accounts_receivable, cash_movements
7. **¿Cómo termina el proceso?** No aplica
8. **¿Qué sucede cuando ocurre un error?** No aplica

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
